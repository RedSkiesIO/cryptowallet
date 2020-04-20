<template>
  <div>
    <div
      class="transaction-notification"
    >
      <q-dialog
        v-model="showTxNotification"
        seamless
        position="bottom"
        :content-class="getClass"
      >
        <div
          v-if="newTxModalData"
          class="row justify-between"
          style="width: 100%; max-width: 600px;"
        >
          <div class="col-2">
            <img
              :src="newTxModalData.logo"
              class="coin-logo"
            >
          </div>
          <div class="label col-6">
            {{ $t('newTxIntro') }} {{ newTxModalData.value }} {{ newTxModalData.symbol }}!
          </div>
          <div class="button-grp col-4">
            <q-btn
              flat
              :label="$t('view')"
              @click="viewTx(newTxModalData.id, newTxModalData.wallet_id)"
            />
            <q-btn
              v-close-popup
              flat
              icon="close"
              @click="closeNotification"
            />
          </div>
        </div>
      </q-dialog>
    </div>
    <section
      v-if="!hideHeader"
      class="header-section"
    >
      <div class="header-back-button-wrapper">
        <q-btn
          :class="{ hideBackButton: !isBackButtonEnabled }"
          :disable="!isBackButtonEnabled"
          icon="arrow_back"
          color="primary"
          size="lg"
          class="icon-btn back-arrow-btn"
          flat
          @click.prevent="goBack"
        />
      </div>

      <div v-if="coinHeading">
        <h1 class="header-h1">
          <img
            :src="coinLogo"
            class="coin-logo"
          >
          {{ wallet.displayName }}
        </h1>
      </div>
      <div v-else>
        <div v-if="heading === 'CryptoWallet'">
          <h1 class="header-h1 logo">
            {{ heading }}
          </h1>
        </div>
        <div v-else>
          <h1 class="header-h1">
            {{ heading }}
          </h1>
        </div>
      </div>
      <!--
      <div
        v-if="displayAddWallet"
        class="header-settings-button-wrapper"
      >
        <q-btn
          icon="add"
          color="primary"
          size="lg"
          class="icon-btn icon-btn-right"
          flat
          @click.prevent="openWalletsModal"
        />
      </div> -->

      <div
        v-if="displayPriceChart"
        class="header-settings-button-wrapper"
      />

      <div
        v-if="displayAccounts"
        class="header-accounts-button-wrapper"
      >
        <q-btn
          icon="people"
          color="primary"
          size="lg"
          class="icon-btn icon-btn-right"
          flat
          @click.prevent="setAccountModalOpened(true)"
        />
      </div>

      <div
        v-if="coinHeading"
        class="header-accounts-button-wrapper"
      >
        <q-btn
          icon="crop_free"
          color="primary"
          size="lg"
          class="icon-btn icon-btn-right"
          flat
          @click.prevent="scan"
        />
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import IconList from '@/statics/cc-icons/icons-list.json';
import Wallet from '@/store/wallet/entities/wallet';

export default {
  name: 'Header',
  data() {
    return {
      isBackButtonEnabled: false,
      newTxModalData: null,
      showTxNotification: false,
      enableTxNotification: true,
    };
  },

  computed: {
    ...mapState({
      id: (state) => { return state.route.params.id; },
      delay: (state) => { return state.settings.delay; },
      modals: (state) => { return state.modals; },
    }),

    wallet() {
      if (this.id) {
        return this.$store.getters['entities/wallet/find'](this.id);
      }
      return Wallet.query().where((wallet) => {
        return wallet.name === 'Catalyst' && wallet.account_id === 1;
      }).get()[0];
    },

    selectedCurrency() {
      return this.$store.state.settings.selectedCurrency;
    },

    displayAccounts() {
      return this.$route.path === '/';
    },

    displayAddWallet() {
      return this.$route.path === '/wallet';
    },

    displayPriceChart() {
      if (this.wallet && this.selectedCurrency) {
        const price = this.$store.getters['entities/latestPrice/find'](`${this.wallet.symbol}_${this.selectedCurrency.code}`);
        if (price) {
          return this.$route.name === 'walletSingle'
                || this.$route.name === 'sendCoinSingle';
        }
      }
      return false;
    },

    heading() {
      if (this.$route.name === 'setup') { return ''; }
      if (this.$route.name === 'exchange') { return this.$t('exchange'); }
      if (this.$route.name === 'settings') { return this.$t('settings'); }
      return this.$t('cryptoWallet');
    },

    coinHeading() {
      if (this.$route.name === 'walletSingle'
          || this.$route.name === 'sendCoinSingle'
          || this.$route.name === 'receiveCoinSingle'
          || this.$route.name === 'coinSinglePrices'
          || this.$route.name === 'wallet') {
        return true;
      }
      return false;
    },

    getClass() {
      if (this.$route.name === 'walletSingle' || this.$route.name === 'wallet'
      || this.$route.name === 'settings') {
        return 'transaction-notification bottom-space';
      }
      return 'transaction-notification bottom';
    },

    hideHeader() {
      if (this.$route.path === '/setup/0') {
        return true;
      }
      return false;
    },

    coinLogo() {
      if (IconList.find((icon) => { return icon.symbol === this.wallet.symbol.toUpperCase(); })) {
        return `./statics/cc-icons/color/${this.wallet.symbol.toLowerCase()}.svg`;
      }
      return './statics/cc-icons/color/generic.svg';
    },
    txsLength() {
      return this.$store.getters['entities/tx/all']().length;
    },
    txs() {
      return this.$store.getters['entities/tx/all']();
    },
  },

  watch: {
    $route() {
      if (window.history.length > 0
          && this.$route.path !== '/setup/0'
          && this.$route.path !== '/setup/7'
          && this.$route.path !== '/'
          && this.$route.path !== '/wallet') {
        this.isBackButtonEnabled = true;
      } else {
        this.isBackButtonEnabled = false;
      }
    },
    txsLength(newValue, oldValue) {
      if (this.enableTxNotification && (newValue > oldValue)) {
        const newTransactions = this.txs.slice(oldValue);
        this.showNotification(newTransactions);
      }
    },
  },

  mounted() {
    this.$root.$on('enableTxNotifications', (value) => {
      this.enableTxNotification = value;
    });
  },

  methods: {
    goBack() {
      this.$router.go(-1);
    },

    setAccountModalOpened(value) {
      this.$store.dispatch('modals/setSelectAccountModalOpened', value);
    },

    openWalletsModal() {
      this.$store.dispatch('modals/setAddWalletModalOpened', true);
    },

    openChartModal() {
      this.$router.push({ path: `/wallet/single/prices/${this.wallet.id}` });
    },

    showNotification(txs) {
      const tx = txs.shift();
      if (!tx.sent) {
        const wallet = this.$store.getters['entities/wallet/find'](tx.wallet_id);
        let logo;
        if (IconList.find((icon) => { return icon.symbol === wallet.symbol.toUpperCase(); })) {
          logo = `./statics/cc-icons/color/${wallet.symbol.toLowerCase()}.svg`;
        } else {
          logo = './statics/cc-icons/color/generic.svg';
        }
        this.newTxModalData = {
          logo,
          value: tx.value,
          symbol: wallet.symbol,
          id: tx.hash,
          wallet_id: tx.wallet_id,
        };
        this.showTxNotification = true;
        const wait = 10000;
        setTimeout(() => {
          this.showTxNotification = false;
          this.newTxModalData = null;
          if (txs.length > 0) {
            this.showNotification(txs);
          }
        }, wait);
      }
    },

    closeNotification() {
      this.showTxNotification = false;
      this.newTxModalData = null;
    },

    viewTx(id, walletId) {
      Object.keys(this.modals).forEach((modal) => {
        if (this.modals[modal] === true) {
          const capitalized = modal.charAt(0).toUpperCase() + modal.slice(1);
          this.$store.dispatch(`modals/set${capitalized}`, false);
        }
      });
      setTimeout(() => {
        const route = this.$route.name;
        if (route !== 'walletSingle') {
          this.$router.push({ path: `/wallet/single/${walletId}` });
        }
        setTimeout(() => {
          this.$store.dispatch('modals/setNewTxData', id);
          this.closeNotification();
        }, this.delay.short);
      }, this.delay.short);
    },

    scan() {
      this.$store.dispatch('qrcode/setQRMode', 'restore');
      this.$store.dispatch('qrcode/scanQRCode');
      const invalidAddress = this.$t('ethereumAddressInvalid');
      // const codeReader = new this.$QRScanner();
      setTimeout(() => {
        const scanQR = () => {
          this.codeReader
            .decodeOnceFromVideoDevice(undefined, 'video')
            .then((result) => {
              let { text } = result;
              let amount;
              if (text.includes(':')) {
                const query = new URL(text);
                text = query.pathname;
                const queryParams = new URLSearchParams(query.search);
                if (queryParams.has('amount')) {
                  amount = queryParams.get('amount');
                }
              }
              const coinSDK = this.coinSDKS.Catalyst;
              const isValid = coinSDK.validateAddress(text, {});
              if (isValid) {
                this.$store.dispatch('qrcode/setScannedAddress', text);
                if (amount) {
                  this.$store.dispatch('qrcode/setScannedAmount', amount);
                }

                this.codeReader.reset();

                this.$store.dispatch('qrcode/cancelScanning');
                this.$router.push({ path: 'wallet/single/send/3' });
              } else {
                this.$toast.create(10, invalidAddress, this.delay.normal);
                const waitForToast = 5000;
                setTimeout(() => { return scanQR(); }, waitForToast);
              }
            })
            .catch((err) => { return console.error(err); });
          this.codeReader.reset();
        };
        scanQR();
      }, this.delay.normal);
    },
  },
};
</script>

<style>
.header-section {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 2.5rem;
  height: 2.5rem + constant(safe-area-inset-top);
  height: 2.5rem + env(safe-area-inset-top);
  font-family: 'CooperHewitt-Semibold';
  background: rgba(255,255,255,0);
  position: relative;
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
  position: fixed;
  width: 100%;
  z-index: 99;
}

.header-h1 {
  letter-spacing: normal;
  font-size: 1.5em;
  margin-top: 0.3em;
  position: relative;
}

.header-h1.logo {
  font-family: 'CooperHewitt-BoldItalic';
}

.header-back-button-wrapper {
  position: absolute;
  left: 0;
  height: 100%;
  display: flex;
  align-items: center;
}

.header-settings-button-wrapper,
.header-accounts-button-wrapper {
  position: absolute;
  right: 0rem;
  height: 100%;
  display: flex;
  align-items: center;
}

/* .header-accounts-button-wrapper {
  right: .8rem;
} */

.icon-btn {
  margin: 0;
  padding-bottom: 0;
  min-height: auto;
  height: 100%;
  position: relative;
  width: 2em;
  padding: 0;
}

.back-arrow-btn .q-btn__content {
  justify-content: flex-start;
}

.icon-btn-right .q-btn__content {
  justify-content: flex-end;
}

.back-arrow-btn .q-focus-helper {
  display: none;
}

.coin-logo {
  height: 1.5rem;
  margin-right: 0.2rem;
  position: relative;
  top: 0.2em;
}

.hideBackButton {
  display: none;
}

/* .transaction-notification {
  max-width: 600px;
} */
.transaction-notification .q-dialog__inner{
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-box-pack: center;
  justify-content: center;
  background: #eee;
  color: #1e3c57;
  bottom: 80px;
  border-top: 1px solid #1e3c57;
}

.transaction-notification .label {
  padding-left: 1rem;
  padding: 1rem 0;
  line-height: 2.5;
  width: fit-content !important;
  font-size: inherit;
}

.transaction-notification .button-grp {
  padding:1rem 0;
  width: fit-content !important;
}

.bottom-space {
  z-index: 1999;
}

.bottom-space .q-dialog__inner {
  bottom: 80px;
}

.bottom {
  z-index: 9999;
}

.bottom .q-dialog__inner {
  bottom: 0;
}

.transaction-notification .coin-logo {
  margin: 1rem;
  margin-right: 0;
  height: 2rem;
  top: 0;
}

</style>
