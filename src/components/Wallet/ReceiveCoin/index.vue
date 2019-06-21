<template>
  <div>
    <div class="header-section">
      <div class="header-back-button-wrapper">
        <q-btn
          icon="arrow_back"
          size="lg"
          class="icon-btn back-arrow-btn"
          flat
          @click.prevent="goBack"
        />
      </div>
      <h1 class="header-h1">
        {{ $t('receive') }}
      </h1>
    </div>
    <div
      v-if="wallet"
      class="modal-layout-wrapper"
    >
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
        <div
          v-if="wallet.sdk==='Bitcoin'"
          class="new-address row justify-center"
        >
          <p>
            {{ $t('newAddress1') }} {{ wallet.name }} {{ $t('newAddress2') }}
            <q-icon
              name="help_outline"
              size="1.1rem"
              class="help-icon"
              @click="hdWalletDialogOpened = true"
            />
          </p>
        </div>
        <q-dialog
          v-model="hdWalletDialogOpened"
        >
          <q-card
            style="width: 300px"
            class="dialog"
          >
            <q-card-section>
              <h2>
                {{ $t('hdWallet') }}
              </h2>
              <p>
                {{ $t('hdWalletExplainer') }}
              </p>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn
                v-close-dialog
                flat
                :label="$t('ok')"
                color="blueish"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
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
      hdWalletDialogOpened: false,
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
    async qrCode() {
      const options = {
        width: 300,
        height: 300,
      };
      if (typeof this.address === 'string') {
        await QRCode.toDataURL(this.address, options, (err, url) => {
          if (err) {
            this.errorHandler(err);
          } else {
            this.qrCodeDataURL = url;
          }
        });
      }
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
    goBack() {
      this.$router.go(-1);
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

.new-address {
  padding: 0 1rem;
  text-align: center;
}

.help-icon {
  background: white;
  z-index: 2;
  position: relative;
  top: -0.1rem;
  margin-left: 0.1rem;
  color: #e49ebe;
}
</style>
