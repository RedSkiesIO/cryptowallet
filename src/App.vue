<template>
  <div :class="{ shrinked : settings.layout !== 'dark' }">
    <div
      id="q-app"
      :class="{ hidden: hidden }"
    >
      <div
        v-if="settings.loading"
        class="app-loading background"
      >
        <Spinner/>
      </div>
      <div v-else>
        <router-view/>
        <WalletsModal/>
        <PriceChartModal/>
        <SelectAccountModal/>
        <SendCoinModal/>
        <ReceiveCoinModal/>
        <CoinHistoryModal/>
        <ConfirmSendModal/>
        <SendSuccessModal/>
      </div>
    </div>
    <Scanner v-if="hidden"/>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Latest from '@/store/latestPrice';
import Prices from '@/store/prices';
import toEncryptConfig from '@/plugins/AppDataEncryption/config.js';
import Spinner from '@/components/Spinner';
import Scanner from '@/components/Scanner';
import WalletsModal from '@/components/Modals/Wallets';
import PriceChartModal from '@/components/Modals/PriceCharts';
import SelectAccountModal from '@/components/Modals/SelectAccount';
import SendCoinModal from '@/components/Modals/SendCoin';
import ReceiveCoinModal from '@/components/Modals/ReceiveCoin';
import CoinHistoryModal from '@/components/Modals/CoinHistory';
import ConfirmSendModal from '@/components/Modals/ConfirmSend';
import SendSuccessModal from '@/components/Modals/SendSuccess';

export default {
  name: 'App',
  components: {
    Spinner,
    Scanner,
    WalletsModal,
    PriceChartModal,
    SelectAccountModal,
    SendCoinModal,
    ReceiveCoinModal,
    CoinHistoryModal,
    ConfirmSendModal,
    SendSuccessModal,
  },

  data() {
    return {
      hidden: false,
    };
  },

  computed: {
    ...mapState({
      settings: state => state.settings,
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
     * Encrypts and decrypts app data according to toEncryptConfig
     *
     * @todo Konrad Make it so the data in the Loki database is always encrypted
     * Meaning, ecrypt when saved to Loki, decrypt when hydrating
     */
    '$q.appVisible': {
      handler(visible) {
        const encryptionUtil = new this.AppDataEncryption(toEncryptConfig);
        if (visible) encryptionUtil.decrypt('pin hash');
        if (!visible) encryptionUtil.encrypt('pin hash');
      },
    },

    /**
     * Waits until hydration is completed,
     * If there are no Accounts, got to setup
     */
    'settings.loading': {
      handler(value) {
        if (value) return false;
        if (this.accounts.length < 1) this.$router.push({ path: '/setup/0' });
        return true;
      },

      'settings.selectedAccount': {
        handler(value) {
          if (!value) this.$router.push({ path: '/' });
        },
      },
    },
  },


  beforeCreate() {

  },

  mounted() {
    window.store = this.$store;
    if (!this.settings.authenticatedAccount) this.$router.push({ path: '/' });
    this.fetchPrices();
    // if (!this.settings.selectedAccount) this.$router.push({ path: '/setup/0' });

    // @todo figure this bit out, salt is causing errors
    /* if (this.account.salt === null) {
      this.$router.push({ path: 'setup/seed' });
      return false;
    }

    if (this.account.pin === null) {
      this.$router.push({ path: 'setup/Pin' });
      return false;
    }

    return true; */

    this.$root.$on('scanQRCode', () => {
      this.hidden = true;
      if (typeof QRScanner !== 'undefined') QRScanner.show(() => {});
    });

    this.$root.$on('cancelScanning', () => {
      if (typeof QRScanner !== 'undefined') {
        QRScanner.hide(() => {});
        QRScanner.destroy(() => {});
      }
      setTimeout(() => {
        this.$root.$emit('sendCoinModalOpened', true);
      }, 500);

      setTimeout(() => {
        this.hidden = false;
      }, 1000);
    });
  },

  beforeMount() {

  },

  beforeUpdate() {

  },

  updated() {

  },

  beforeDestroy() {

  },

  destroyed() {

  },
  methods: {
    storePriceData(coin) {
      const coinSDK = this.coinSDKS.Bitcoin;
      return new Promise(async (resolve, reject) => {
        try {
          const dayData = await coinSDK.getHistoricalData(coin, this.selectedCurrency.code, 'day');
          const weekData = await coinSDK.getHistoricalData(coin, this.selectedCurrency.code, 'week');
          const monthData = await coinSDK.getHistoricalData(coin, this.selectedCurrency.code, 'month');

          Prices.$insert({
            data:
            {
              coin,
              currency: this.selectedCurrency.code,
              period: 'day',
              updated: +new Date(),
              data: dayData,
            },
          });
          Prices.$insert({
            data:
            {
              coin,
              currency: this.selectedCurrency.code,
              period: 'week',
              updated: +new Date(),
              data: weekData,
            },
          });
          Prices.$insert({
            data:
            {
              coin,
              currency: this.selectedCurrency.code,
              period: 'month',
              updated: +new Date(),
              data: monthData,
            },
          });
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    },

    async fetchPrices() {
      const coins = this.supportedCoins.map(x => x.symbol);
      const coinSDK = this.coinSDKS.Bitcoin;

      function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
      }
      coins.filter(onlyUnique);

      try {
        const prices = await coinSDK.getPriceFeed(coins, ['GBP', 'USD', 'EUR']);

        const promises = [];
        coins.forEach((coin) => {
          promises.push(new Promise(async res => res(this.storePriceData(coin))));
        });

        await Promise.all(promises);

        console.log('prices :', prices);

        Latest.$insert({
          data:
            {
              coin: 'BTC',
              currency: 'GBP',
              updated: +new Date(),
              data: prices.BTC.GBP,
            },
        });
        Latest.$insert({
          data:
            {
              coin: 'ETH',
              currency: 'GBP',
              updated: +new Date(),
              data: prices.ETH.GBP,
            },
        });
        Latest.$insert({
          data:
            {
              coin: 'LTC',
              currency: 'GBP',
              updated: +new Date(),
              data: prices.LTC.GBP,
            },
        });
        Latest.$insert({
          data:
            {
              coin: 'DASH',
              currency: 'GBP',
              updated: +new Date(),
              data: prices.DASH.GBP,
            },
        });
        const newPrice = Latest.find(['BTC_GBP']);
        console.log('newPrice :', newPrice);
      } catch (e) {
        console.log('error :', e);
      }
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
}

.background {
  background-color: #1e3c57;
  width: 100%;
  height: 100%;
  position: absolute;
  background: linear-gradient(to bottom, #193650 5%,#1e3c57 46%,#1a354e 100%);
}

.shrinked .background {
  height: 27rem;
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
  background: linear-gradient(to bottom, #193650 5%, #1e3c57 46%, #1a354e 100%)
}


.modal-layout-wrapper {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 2.5rem);
  position: relative;
  padding: 0.5rem;
  overflow: scroll;
}

.modal-layout-wrapper.center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-layout-wrapper.no-padding {
  padding: 0;
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

</style>
