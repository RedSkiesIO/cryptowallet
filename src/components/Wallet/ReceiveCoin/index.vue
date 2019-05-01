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
      delay: (state) => { return state.settings.delay; },
    }),
    wallet() {
      return this.$store.getters['entities/wallet/find'](this.id);
    },
    address() {
      if (!this.wallet.externalAddress) { return null; }
      return this.wallet.externalAddress;
    },
  },
  mounted() {
    this.qrCode();
  },
  methods: {
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
