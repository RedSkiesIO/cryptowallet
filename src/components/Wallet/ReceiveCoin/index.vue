<template>
  <div class="receive-coin-box">
    <CoinHeader :wallet="wallet"/>

    <div class="send-modal-heading">
      <h3>Your Address</h3>
      <span class="h3-line"/>
    </div>
    <div class="address break">{{ getAddress() }}</div>

    <q-btn
      :label="$t('copy')"
      color="blueish"
      size="sm"
      @click="copyToClipboard"
    />

    <q-btn
      :label="$t('share')"
      class="share-btn"
      color="blueish"
      size="sm"
      @click="share()"
    />

    <div class="send-modal-heading">
      <h3>Scan QR Code</h3>
      <span class="h3-line"/>
    </div>

    <div class="qr-code">
      <img
        v-if="qrCodeDataURL"
        :src="qrCodeDataURL"
      >
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import QRCode from 'qrcode';
import CoinHeader from '@/components/Wallet/CoinHeader';
import Wallet from '@/store/wallet/entities/wallet';
import Address from '@/store/wallet/entities/address';

export default {
  name: 'Receive',
  components: {
    CoinHeader,
  },
  data() {
    return {
      qrCodeDataURL: null,
    };
  },
  computed: {
    ...mapState({
      id: state => state.route.params.id,
      authenticatedAccount: state => state.settings.authenticatedAccount,
    }),
    wallet() {
      return this.$store.getters['entities/wallet/find'](this.id);
    },
    address() {
      return this.getAddress();
    },
  },
  watch: {
    address() {
      this.qrCode();
    },
  },
  mounted() {
    this.qrCode();
  },
  methods: {
    getAddress() {
      if (this.wallet.externalAddress) return this.wallet.externalAddress;
      return this.generateExternalAddress();
    },
    generateExternalAddress() {
      const wallet = this.activeWallets[this.authenticatedAccount][this.wallet.name];
      const coinSDK = this.coinSDKS[this.wallet.sdk];
      const keyPair = coinSDK.generateKeyPair(wallet, this.wallet.externalChainAddressIndex);

      Wallet.$update({
        where: record => record.id === this.wallet.id,
        data: { externalAddress: keyPair.address },
      });

      const newAddress = {
        account_id: this.authenticatedAccount,
        wallet_id: this.wallet.id,
        chain: 'external',
        address: keyPair.address,
        index: this.wallet.externalChainAddressIndex,
      };

      Address.$insert({ data: newAddress });

      Wallet.$update({
        where: record => record.id === this.wallet.id,
        data: { externalChainAddressIndex: this.wallet.externalChainAddressIndex + 1 },
      });

      return keyPair.address;
    },
    copyToClipboard() {
      try {
        cordova.plugins.clipboard.copy(this.address);
        this.$toast.create(0, this.$t('copied'), 200);
      } catch (err) {
        this.errorHandler(err);
      }
    },
    qrCode() {
      const options = {
        width: 250,
        height: 250,
      };

      if (typeof this.address !== 'string') return false;

      QRCode.toDataURL(this.address, options, (err, url) => {
        if (err) {
          this.errorHandler(err);
          return false;
        }
        this.qrCodeDataURL = url;
        return false;
      });

      return false;
    },
    share() {
      const that = this;
      const options = {
        message: `${this.address}`,
        subject: `Here's my ${this.wallet.name} address`,
      };

      function onSuccess(result) {
        console.log(result);
      }

      function onError(msg) {
        that.errorHandler(new Error(msg));
      }

      window.plugins.socialsharing.shareWithOptions(options, onSuccess, onError);
    },
  },
};
</script>

<style scoped>

.address {
  font-size: 0.8rem;
  margin: 1rem 0;
}

.break {
  word-break: break-all;
}

.to-copy-input {
  position: absolute;
  left: -9999px;
}

.qr-code {
  margin: 0rem;
  display: flex;
  justify-content: center;
}

.share-btn {
  margin-left: 0.5rem;
}
</style>
