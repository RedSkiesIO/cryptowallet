<template>
  <div
    class="flex justify-center"
    :class="{ shrinked : settings.layout !== 'dark' }"
  >
    <LoadingScreen :show="settings.loading" />

    <div
      id="q-app"
      :class="{ hidden: scanning }"
    >
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
        <SendFailureModal />
        <AddErc20Modal />
      </div>
    </div>
    <Scanner v-if="scanning" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import LoadingScreen from '@/components/LoadingScreen';
import Coin from '@/store/wallet/entities/coin';
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
import SendFailureModal from '@/components/Modals/SendFailure';
import AddErc20Modal from '@/components/Modals/AddErc20';
import OfflineNotice from '@/components/OfflineNotice';

export default {
  name: 'App',
  components: {
    LoadingScreen,
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
    SendFailureModal,
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
      scanning: (state) => { return state.qrcode.scanning; },
      qrMode: (state) => { return state.qrcode.qrMode; },
    }),
    accounts() {
      return this.$store.getters['entities/account/query']().get();
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
    scanning: {
      handler(newValue, oldValue) {
        if (oldValue === false && newValue === true) {
          this.$q.scanning = true;
          if (typeof QRScanner !== 'undefined') {
            QRScanner.show(() => {});
          }
        }

        if (oldValue === true && newValue === false) {
          if (this.qrMode === 'addERC20') {
            this.$store.dispatch('modals/setAddWalletModalOpened', true);
            this.$store.dispatch('modals/setAddErc20ModalOpened', true);
            this.$store.dispatch('qrcode/setQRMode', null);
          } else if (this.qrMode === 'restore') {
            this.$store.dispatch('qrcode/setQRMode', null);
          } else if (this.qrMode !== 'wallet') {
            this.$store.dispatch('qrcode/setQRMode', null);
          } else {
            this.$store.dispatch('modals/setSendCoinModalOpened', true);
          }
          this.codeReader.reset();
          this.$q.scanning = false;
          if (typeof QRScanner !== 'undefined') {
            QRScanner.hide(() => {});
            QRScanner.destroy(() => {});
          }
        }
      },
    },
  },

  async mounted() {
    window.store = this.$store;
    window.app = this;
    if (!this.settings.authenticatedAccount) { this.$router.push({ path: '/' }); }
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
            decimals: coin.decimals,
          };
          if (coin.sdk === 'ERC20') {
            data.parentName = coin.parentName;
            data.parentSdk = coin.parentSdk;
            data.contractAddress = coin.contractAddress;
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
body {
  overflow: hidden;
}
body > div {
  color: white;
  background: #0a2d3e
}

.background {
  background-color: #0a2d3e;
  width: 100%;
  height: 100%;
  position: absolute;
}

.shrinked .background {
  background: rgb(22,172,159);
  background: linear-gradient(0deg, rgba(22,172,159,1) 0%, rgba(10,45,62,1) 100%);
  height: 22.5rem;
  top: 0rem;
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
    width: 100%;
  .q-dialog__inner--maximized > div {
    background: whitesmoke;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
        -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
  }
  .modal-content {
    background: whitesmoke;
    color: black;
  }
}

.dark-modal {
    width: 100%;

    .q-carousel {
      background: none;
    }
    .q-dialog__inner--maximized {
      background: #0a2d3e;
     }
  .q-dialog__inner--maximized > div {
    background: #0a2d3e;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
        -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
  }
}

.q-dialog .modal-layout-wrapper {
  height: calc(100vh)!important;
  height: calc(100vh - constant(safe-area-inset-top))!important;
  height: calc(100vh - env(safe-area-inset-top))!important;
  padding-top: 3.5rem;
  max-width: 600px;
  width: 100%;
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
  color: whitesmoke;
}

.dark-modal .header-section i {
  color: #16ac9f;
}

.dark-modal .modal-layout-wrapper {
    background-color: #0a2d3e;
}

.light-modal .modal-layout-wrapper {
  background: whitesmoke;
}


.modal-layout-wrapper {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 2.5rem);
  height: calc(100vh - 2.5rem - constant(safe-area-inset-top));
  height: calc(100vh - 2.5rem - env(safe-area-inset-top));
  position: relative;
  padding: 0.5rem;
  max-width: 600px;
  width: 100%;
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

.developed-by {
  text-align: center;
  width: 50%;
}

.developed-by {
    font-size: 0.7rem;
    text-transform: uppercase;
    font-family: CooperHewitt-Semibold;
    opacity: 0;
}

.q-btn__wrapper:before {
  box-shadow: none;
}

</style>
