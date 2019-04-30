<template>
  <div class="receive-coin-box">
    <CoinHeader :wallet="wallet" />

    <div class="send-modal-heading">
      <h3>{{ $t('yourAddress') }}</h3>
      <span class="h3-line" />
    </div>
    <div class="address break">
      {{ address }}
    </div>

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
      <h3>{{ $t('scanQR') }}</h3>
      <span class="h3-line" />
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
      id: (state) => { return state.route.params.id; },
      authenticatedAccount: (state) => { return state.settings.authenticatedAccount; },
      delay: (state) => { return state.settings.delay; },
    }),
    wallet() {
      return this.$store.getters['entities/wallet/find'](this.id);
    },
    address() {
      if (this.wallet.externalAddress) { return this.wallet.externalAddress; }
      return this.generateExternalAddress();
    },
  },
  watch: {
    address() {
      console.log(this.address);
      this.qrCode();
    },
  },
  mounted() {
    this.qrCode();
  },
  methods: {
    generateExternalAddress() {
      let address;
      if (this.wallet.sdk === 'ERC20') {
        ({ address } = this.wallet.erc20Wallet);
      } else {
        const coinSDK = this.coinSDKS[this.wallet.sdk];

        const keyPair = coinSDK.generateKeyPair(
          this.wallet.hdWallet, this.wallet.externalChainAddressIndex,
        );

        const newAddress = {
          account_id: this.authenticatedAccount,
          wallet_id: this.wallet.id,
          chain: 'external',
          address: keyPair.address,
          index: this.wallet.externalChainAddressIndex,
        };

        Address.$insert({ data: newAddress });

        ({ address } = keyPair);
      }
      if (this.wallet.sdk === 'Bitcoin') {
        Wallet.$update({
          where: (record) => { return record.id === this.wallet.id; },
          data: {
            externalChainAddressIndex: this.wallet.externalChainAddressIndex + 1,
            externalAddress: address,
          },
        });
      } else {
        Wallet.$update({
          where: (record) => { return record.id === this.wallet.id; },
          data: {
            externalChainAddressIndex: 0,
            externalAddress: address,
          },
        });
      }

      return address;
    },
    copyToClipboard() {
      try {
        cordova.plugins.clipboard.copy(this.address);
        this.$toast.create(0, this.$t('copied'), this.delay.short);
      } catch (err) {
        this.errorHandler(err);
      }
    },
    qrCode() {
      const options = {
        width: 250,
        height: 250,
      };

      if (typeof this.address !== 'string') { return false; }
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
      const options = {
        message: `${this.address}`,
        subject: `Here's my ${this.wallet.name} address`,
      };

      const onError = (msg) => {
        this.errorHandler(new Error(msg));
      };
      window.plugins.socialsharing.shareWithOptions(options, () => {}, onError);
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
