<template>
  <div :class="{ shrinked : settings.layout !== 'dark' }">
    <div
      :class="{done : !settings.loading}"
      class="app-loading background"
    >
      <div class="loading-footer">
        <img
          class="logo-loading"
          src="~/assets/logo-white-horizontal.png"
        >
      </div>

      <Spinner />
    </div>

    <div
      id="q-app"
      :class="{ hidden: hidden }"
    >
      <div v-if="!settings.loading">
        <router-view />
        <SelectAccountModal />
        <NewAccountModal />
        <GetStartedModal />
        <TermsModal />

        <div v-if="settings.authenticatedAccount">
          <OfflineNotice />

          <WalletsModal />
          <PriceChartModal />
          <SendCoinModal />
          <ReceiveCoinModal />
          <ConfirmSendModal />
          <SendSuccessModal />
          <AddErc20Modal />
        </div>
      </div>
    </div>
    <Scanner v-if="hidden" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Coin from '@/store/wallet/entities/coin';
import Spinner from '@/components/Spinner';
import Scanner from '@/components/Scanner';
import WalletsModal from '@/components/Modals/Wallets';
import PriceChartModal from '@/components/Modals/PriceCharts';
import SelectAccountModal from '@/components/Modals/SelectAccount';
import NewAccountModal from '@/components/Modals/NewAccount';
import GetStartedModal from '@/components/Modals/GetStarted';
import TermsModal from '@/components/Modals/Terms';
import SendCoinModal from '@/components/Modals/SendCoin';
import ReceiveCoinModal from '@/components/Modals/ReceiveCoin';
import ConfirmSendModal from '@/components/Modals/ConfirmSend';
import SendSuccessModal from '@/components/Modals/SendSuccess';
import AddErc20Modal from '@/components/Modals/AddErc20';
import OfflineNotice from '@/components/OfflineNotice';

export default {
  name: 'App',
  components: {
    Spinner,
    Scanner,
    WalletsModal,
    PriceChartModal,
    SelectAccountModal,
    NewAccountModal,
    GetStartedModal,
    TermsModal,
    SendCoinModal,
    ReceiveCoinModal,
    ConfirmSendModal,
    SendSuccessModal,
    AddErc20Modal,
    OfflineNotice,
  },

  data() {
    return {
      hidden: false,
      qrOrigin: '',
    };
  },

  computed: {
    ...mapState({
      settings: (state) => { return state.settings; },
      delay: (state) => { return state.settings.delay; },

    }),
    accounts() {
      return this.$store.getters['entities/account/query']().get();
    },
    selectedCurrency() {
      return this.$store.state.settings.selectedCurrency;
    },
    supportedCoins() {
      return this.$store.state.settings.supportedCoins;
    },
  },

  watch: {
    /**
     * Waits until hydration is completed,
     * If there are no Accounts, got to setup
     */
    'settings.loading': {
      handler() {
        if (this.accounts.length < 1) {
          this.$router.push({ path: '/setup/0' });
        }
        this.storeSupportedCoins();
        return true;
      },
    },
  },

  async mounted() {
    window.store = this.$store;
    window.app = this;

    if (!this.settings.authenticatedAccount) { this.$router.push({ path: '/' }); }

    this.$root.$on('scanQRCode', (origin) => {
      this.qrOrigin = origin;
      this.$q.scanning = true;
      this.hidden = true;
      if (typeof QRScanner !== 'undefined') { QRScanner.show(() => {}); }
    });

    this.$root.$on('cancelScanning', () => {
      if (typeof QRScanner !== 'undefined') {
        QRScanner.hide(() => {});
        QRScanner.destroy(() => {});
      }

      if (this.qrOrigin === 'addErc20') {
        setTimeout(() => {
          this.$q.scanning = false;
          this.$root.$emit('walletsModalOpened', true);
          this.$root.$emit('erc20ModalOpened', true);
        }, this.delay.short);
      } else {
        setTimeout(() => {
          this.$q.scanning = false;
          this.$root.$emit('sendCoinModalOpened', true);
        }, this.delay.short);
      }

      setTimeout(() => {
        this.$q.scanning = false;
        this.hidden = false;
      }, this.delay.long);
    });
  },

  methods: {
    storeSupportedCoins() {
      this.supportedCoins.forEach((coin) => {
        const isThere = Coin.find([coin.name]);

        if (!isThere) {
          const data = {
            name: coin.name,
            displayName: coin.displayName,
            sdk: coin.sdk,
            symbol: coin.symbol,
            network: coin.network,
            denomination: coin.denomination,
            minConfirmations: coin.minConfirmations,
          };
          if (coin.sdk === 'ERC20') {
            data.parentName = coin.parentName;
            data.parentSdk = coin.parentSdk;
            data.contractAddress = coin.contractAddress;
            data.decimals = coin.decimals;
          }
          Coin.$insert({
            data,
          });
        }
      });
    },
  },
};
</script>

<style lang='scss'>
body > div {
  color: white;
}

.app-loading {
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0!important;
  height: 100%!important;
  z-index: 999999;
  transition: opacity 0.2s ease-in-out;
  transition-delay: 500ms;
}

@keyframes LOADING {
  0%   { opacity: 1; }
  100% { opacity: 0; }
}

.app-loading.done {
  animation: LOADING 150ms forwards;
  animation-timing-function: ease-out;
  animation-delay: 250ms;
  pointer-events: none;
}

.app-loading.background {
  border-bottom: none!important;
}

.background {
  background-color: #1e3c57;
  width: 100%;
  height: 100%;
  position: absolute;
  background: linear-gradient(to bottom, #193650 5%,#1e3c57 46%,#1a354e 100%);
}

.shrinked .background {
  height: 22.5rem;
  top: -15rem;
  border-bottom: 0.3rem solid #4e677d;
}

.new-wallet-btn-wrapper {
  padding: 1rem;
  display: flex;
  justify-content: center;
  box-shadow: 0px 0px 11px 0px rgba(0, 0, 0, 0.5);
  background: #2c5070;
  position: relative;
}

.close-button-wrapper {
  padding: 0.5rem;
  height: 2.7rem;
}

.light-modal {
  .modal-content {
    background: white;
    color: black;
  }
}

.q-dialog .modal-layout-wrapper {
  height: calc(100vh - 2.5rem)!important;
}

.light-modal .header-section {
  background: whitesmoke;
}

.light-modal .header-section i {
  color: #1e3c57;
}

.light-modal .header-section .header-h1 {
  color: #1e3c57;
  text-shadow: none;
}

.dark-modal .header-section {
  color: white;
}

.dark-modal .header-section i {
  color: #78d2e6;
}

.dark-modal .modal-layout-wrapper {
  background: linear-gradient(to bottom, #193650 5%, #1e3c57 46%, #1a354e 100%);
}

.light-modal .modal-layout-wrapper {
  background: white;
}

.q-dialog__inner .header-section {
  height: 2.5rem!important;
}

.modal-layout-wrapper {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 2.5rem);
  position: relative;
  padding: 0.5rem;
  overflow: scroll;
}

.modal-layout-wrapper.full {
  height: 100vh!important;
}

.modal-layout-wrapper.center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-layout-wrapper.no-padding {
  padding: 0;
}

.modal-layout-wrapper.centered {
  display: flex;
  align-items: center;
  justify-content: center;
}

.light-modal .modal-layout-wrapper {
  color: #1e3c57;
}

.dark-modal .modal-layout-wrapper {
  color: white;
}

.modal {
  font-family: Montserrat-Regular;
}

.loading-footer {
  position: absolute;
  width: 10rem;
  height: 5rem;
  bottom: 0;
  opacity: 0.2;
  margin: 0 auto;
  left: 0;
  right: 0;
  text-align: center;
}

.loading-footer.emphasised {
  opacity: 1;
}

.developed-by {
  text-align: center;
  width: 50%;
}

.logo-loading {
  width: 8rem;
  height: auto;
  margin: 0 auto;
}

.developed-by {
    font-size: 0.7rem;
    text-transform: uppercase;
    font-family: CooperHewitt-Semibold;
    opacity: 0;
}

</style>
