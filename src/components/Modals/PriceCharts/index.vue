<template>
  <div>
    <q-modal
      v-model="priceChartModalOpened"
      class="dark-modal modal"
    >
      <div
        :class="{ active: loading }"
        class="sending-spinner-overlay"
      >
        <Spinner/>
      </div>
      <div
        v-if="wallet"
        class="header-section">
        <div class="header-back-button-wrapper">
          <q-btn
            icon="arrow_back"
            size="lg"
            class="icon-btn back-arrow-btn"
            flat
            @click.prevent="goBack"
          />
        </div>

        <div>
          <img
            :src="coinLogo"
            class="coin-logo"
          >
          {{ wallet.displayName }}
        </div>

        <div
          class="header-settings-button-wrapper"
        >
          <q-btn
            icon="refresh"
            color="secondary"
            size="lg"
            class="icon-btn icon-btn-right"
            flat
            @click="loadData"
          />
        </div>
      </div>
      <div
        v-if="wallet"
        class="modal-layout-wrapper"
      >
        <div class="price-info justify-center">

          <div class="row labels">
            <div class="col-6">1 {{ coinSymbol }} / {{ selectedCurrency.code }}</div>
            <div class="col-6">Volume 24h {{ selectedCurrency.code }}</div>
          </div>
          <div class="row price">
            <div class="col-6">{{ latestPrice.data.PRICE }} </div>
            <div class="col-6">{{ latestPrice.data.VOLUME24HOURTO }} </div>
          </div>
          <div
            :style="{ color: percentColor}"
            class="row">
            <div class="col-6">{{ latestPrice.data.CHANGEPCT24HOUR }}%</div>

          </div>
        </div>
        <PriceChart
          v-if="priceChartModalOpened"
          :gradient="gradientStroke"
        />
      </div>
    </q-modal>
  </div>

</template>

<script>
import { mapState } from 'vuex';
import PriceChart from '@/components/PriceCharts/ChartContainer';
import Spinner from '@/components/Spinner';
import Prices from '@/store/prices';
import Latest from '@/store/latestPrice';


export default {
  name: 'PriceCharts',
  components: {
    PriceChart,
    Spinner,
  },
  data() {
    return {
      priceChartModalOpened: false,
      gradientStroke: '',
      loading: false,
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
    selectedCurrency() {
      return this.$store.state.settings.selectedCurrency;
    },
    supportedCoins() {
      return this.$store.state.settings.supportedCoins;
    },
    coinSymbol() {
      return this.supportedCoins.find(coin => coin.name === this.wallet.name).symbol;
    },
    latestPrice() {
      // return Latest.find([`${this.coinSymbol}_${this.selectedCurrency.code}`]);
      const prices = this.$store.getters['entities/latestPrice/find'](`${this.coinSymbol}_${this.selectedCurrency.code}`);
      if (!prices) {
        this.loadData();
      }
      return this.$store.getters['entities/latestPrice/find'](`${this.coinSymbol}_${this.selectedCurrency.code}`);
    },
    percentColor() {
      const priceChange = this.latestPrice.data.CHANGEPCT24HOUR;
      if (priceChange.charAt(0) !== '-') {
        return 'lime';
      }
      return '#de4662';
    },
    coinLogo() {
      const coin = this.supportedCoins.find(cc => cc.name === this.wallet.name);
      /* eslint-disable-next-line */
      return require(`@/assets/cc-icons/color/${coin.symbol.toLowerCase()}.svg`);
    },
  },
  watch: {
    $route: {
      handler(to) {
        if (to.name === 'coinPrices' || to.name === 'coinSinglePrices') {
          this.priceChartModalOpened = true;
        } else {
          this.priceChartModalOpened = false;
        }
      },
    },
  },
  async mounted() {
    this.$root.$on('priceChartModalOpened', (value) => {
      if (value === true) {
        this.priceChartModalOpened = value;
      }
    });
  },
  methods: {
    viewChart() {
      this.priceChartModalOpened = true;
    },
    async loadData() {
      this.loading = true;

      let coinSDK = this.coinSDKS[this.wallet.sdk];
      if (this.wallet.sdk === 'ERC20') {
        coinSDK = this.coinSDKS[this.wallet.parentSdk];
      }
      try {
        const dayData = await coinSDK.getHistoricalData(this.coinSymbol, this.selectedCurrency.code, 'day');
        const weekData = await coinSDK.getHistoricalData(this.coinSymbol, this.selectedCurrency.code, 'week');
        const monthData = await coinSDK.getHistoricalData(this.coinSymbol, this.selectedCurrency.code, 'month');
        const latestPrice = await coinSDK.getPriceFeed(
          [this.coinSymbol],
          [this.selectedCurrency.code],
        );
        const wherePrice = (record, item) => (
          record.coin === item.coin
             && record.currency === item.currency
             && record.period === item.period
        );

        Prices.$update({
          where: record => wherePrice(record, {
            coin: this.coinSymbol,
            currency: this.selectedCurrency.code,
            period: 'day',
          }),
          data: {
            updated: +new Date(),
            data: dayData,
          },
        });
        Prices.$update({
          where: record => wherePrice(record, {
            coin: this.coinSymbol,
            currency: this.selectedCurrency.code,
            period: 'week',
          }),
          data: {
            updated: +new Date(),
            data: weekData,
          },
        });
        Prices.$update({
          where: record => wherePrice(record, {
            coin: this.coinSymbol,
            currency: this.selectedCurrency.code,
            period: 'month',
          }),
          data: {
            updated: +new Date(),
            data: monthData,
          },
        });
        const whereLatest = (record, item) => (
          record.coin === item.coin
             && record.currency === item.currency
        );
        Latest.$update({
          where: record => whereLatest(record, {
            coin: this.coinSymbol,
            currency: this.selectedCurrency.code,
          }),
          data: {
            updated: +new Date(),
            data: latestPrice[this.coinSymbol][this.selectedCurrency.code],
          },
        });
      } catch (e) {
        console.log(e);
      }
      this.loading = false;
      return false;
    },
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="scss">
.close-btn .q-btn-inner .modal-layout-wrapper{
  justify-content: flex-start;
}

.modal-layout-wrapper{
  padding: 1em;
  margin-top: "10px";
}

.q-toolbar{
  background-color: #1e3c57;
}

.price-info{
  margin-top: 15px;
  margin-bottom: 10px;
  padding: 0 0.5em;
}

.price-info .row{
  padding-bottom: 5px;
}

.row .price-percent{
  color: #de4662;
}

.row .price{
  font-size: x-large;
  color: white;
}

.row .labels{
  color: sandybrown;
}

.sending-spinner-overlay {
 position: absolute;
 height: 100vh;
 width: 100vw;
 z-index: 0;
 display: flex;
 align-items: center;
 justify-content: center;
 background: rgba(30, 60, 87, 0.9);
 opacity: 0;
 transition: all ease-in-out 250ms;
}

.sending-spinner-overlay.active{
 opacity: 1;
 z-index: 2;
}
</style>
