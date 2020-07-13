<template>
  <div :class="{ shrinked : settings.layout !== 'dark' }">
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
        <AddFundsModal />
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
import AddFundsModal from '@/components/Modals/AddFunds';
// import TorusSDK from '@/helpers/DirectAuth';

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
    AddFundsModal,
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
          } else {
            this.$store.dispatch('modals/setSendCoinModalOpened', true);
          }
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
        // const isThere = Coin.find([coin.name]);
        // const data = {
        //   name: coin.name,
        //   displayName: coin.displayName,
        //   sdk: coin.sdk,
        //   symbol: coin.symbol,
        //   network: coin.network,
        //   denomination: coin.denomination,
        //   minConfirmations: coin.minConfirmations,
        //   decimals: coin.decimals,
        //   api: coin.api,
        //   testnet: coin.testnet ? coin.testnet : false,
        //   transak: coin.transak ? coin.transak : false,
        // };
        // if (!isThere) {
        //   if (coin.sdk === 'ERC20') {
        //     data.parentName = coin.parentName;
        //     data.parentSdk = coin.parentSdk;
        //     data.contractAddress = coin.contractAddress;
        //   }
        Coin.$insert({
          data: coin,
        });
        // }
        // else {
        //   // Coin.$update({
        //   //   where: (record) => { return record.name === isThere.name; },
        //   //   data,
        //   // });
        //   Coin.$insert(data);
        // }
      });
    },
  },
};
</script>

<style lang='styl'>
body > div {
  color: black;
}

.background {
  height: 100%;
  width: 100%;
  position: absolute;
}

.shrinked .background {
  background: rgb(49,255,216);
  background: linear-gradient(332deg, rgba(49,255,216,1) 0%, rgba(221,61,255,1) 100%);  width: 100%;
  height: 17.5rem;
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

.light-modal .modal-content {
    background: whitesmoke;
    color: black;
}

.q-dialog .modal-layout-wrapper {
  height: calc(100vh - 2.5rem)!important;
  height: calc(100vh - 2.5rem - constant(safe-area-inset-top))!important;
  height: calc(100vh - 2.5rem - env(safe-area-inset-top))!important;
}

.light-modal .header-section {
  background: whitesmoke;
}

.dark-modal .header-section {
  color: black;
  background: whitesmoke;
}

.dark-modal .header-section i {
  color: var(--q-color-primary);
}

.dark-modal .modal-layout-wrapper {
    color: black;
    background-color: whitesmoke;
}

.light-modal .modal-layout-wrapper {
  background: white;
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
  color: slategray;
}

.dark-modal .modal-layout-wrapper {
  color: black;
}

.modal {
  font-family: Inter-Regular;
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

</style>
