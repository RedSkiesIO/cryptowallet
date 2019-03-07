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
        <Spinner />
      </div>
      <div
        v-if="wallet"
        class="header-section"
      >
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
        v-if="wallet && latestPrice"
        class="modal-layout-wrapper"
      >
        <div class="price-info justify-center">
          <div class="row labels">
            <div class="col-6">
              1 {{ coinSymbol }} / {{ selectedCurrency.code }}
            </div>
            <div
              v-if="latestPrice.data.VOLUME24HOURTO !== '£ 0'"
              class="col-6"
            >
              {{ $t('volume24h') }}{{ selectedCurrency.code }}
            </div>
          </div>
          <div class="row price">
            <div class="col-6">
              {{ latestPrice.data.PRICE }}
            </div>
            <div
              v-if="latestPrice.data.VOLUME24HOURTO !== '£ 0'"
              class="col-6"
            >
              {{ latestPrice.data.VOLUME24HOURTO }}
            </div>
          </div>
          <div
            :style="{ color: percentColor}"
            class="row"
          >
            <div class="col-6">
              {{ latestPrice.data.CHANGEPCT24HOUR }}%
            </div>
          </div>
        </div>
        <PriceChart
          v-if="priceChartModalOpened && (showChart || chartDataExists)"
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
import Coin from '@/store/wallet/entities/coin';
import IconList from '@/assets/cc-icons/icons-list.json';


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
      showChart: false,
    };
  },
  computed: {
    ...mapState({
      id: (state) => { return state.route.params.id; },
      authenticatedAccount: (state) => { return state.settings.authenticatedAccount; },
    }),
    wallet() {
      return this.$store.getters['entities/wallet/find'](this.id);
    },
    selectedCurrency() {
      return this.$store.state.settings.selectedCurrency;
    },
    supportedCoins() {
      return Coin.all();
    },
    coinSymbol() {
      return this.supportedCoins.find((coin) => { return coin.name === this.wallet.name; }).symbol;
    },
    latestPrice() {
      const prices = this.$store.getters['entities/latestPrice/find'](`${this.coinSymbol}_${this.selectedCurrency.code}`);
      if (!prices) {
        return null;
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
      if (IconList.find((icon) => { return icon.symbol === this.wallet.symbol.toUpperCase(); })) {
        return `./statics/cc-icons/color/${this.wallet.symbol.toLowerCase()}.svg`;
      }
      return './statics/cc-icons/color/generic.svg';
    },
    chartDataExists() {
      const day = this.$store.getters['entities/prices/find'](`${this.coinSymbol}_${this.selectedCurrency.code}_day`);
      const week = this.$store.getters['entities/prices/find'](`${this.coinSymbol}_${this.selectedCurrency.code}_week`);
      const month = this.$store.getters['entities/prices/find'](`${this.coinSymbol}_${this.selectedCurrency.code}_month`);
      if (!day || !week || !month) {
        return false;
      }
      return true;
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
    priceChartModalOpened: {
      handler(newVal, oldVal) {
        if (oldVal === true && newVal === false) {
          if (this.$store.state.route.name === 'coinPrices'
              || this.$store.state.route.name === 'coinSinglePrices') {
            this.$router.go(-1);
          }
        }
      },
    },
  },
  async mounted() {
    this.$root.$on('priceChartModalOpened', (value) => {
      if (value === true) {
        this.priceChartModalOpened = value;
        this.loadData();
      }
    });
  },
  methods: {
    viewChart() {
      this.priceChartModalOpened = true;
    },
    async loadData() {
      this.showChart = false;
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

        const checkExists = (period, data) => {
          const price = Prices.find([`${this.coinSymbol}_${this.selectedCurrency.code}_${period}`]);
          if (!price) {
            Prices.$insert({
              data: {
                coin: this.coinSymbol,
                currency: this.selectedCurrency.code,
                period,
                updated: +new Date(),
                data,
              },
            });
            return false;
          }
          return true;
        };

        const wherePrice = (record, item) => {
          return (
            record.coin === item.coin
            && record.currency === item.currency
            && record.period === item.period
          );
        };

        if (checkExists('day', dayData)) {
          Prices.$update({
            where: (record) => {
              return wherePrice(record, {
                coin: this.coinSymbol,
                currency: this.selectedCurrency.code,
                period: 'day',
              });
            },
            data: {
              updated: +new Date(),
              data: dayData,
            },
          });
        }
        if (checkExists('week', weekData)) {
          Prices.$update({
            where: (record) => {
              return wherePrice(record, {
                coin: this.coinSymbol,
                currency: this.selectedCurrency.code,
                period: 'week',
              });
            },
            data: {
              updated: +new Date(),
              data: weekData,
            },
          });
        }
        if (checkExists('month', monthData)) {
          Prices.$update({
            where: (record) => {
              return wherePrice(record, {
                coin: this.coinSymbol,
                currency: this.selectedCurrency.code,
                period: 'month',
              });
            },
            data: {
              updated: +new Date(),
              data: monthData,
            },
          });
        }
        const checkPriceExists = (symbol, data) => {
          const price = Latest.find([`${symbol}_${this.selectedCurrency.code}`]);
          if (!price) {
            Latest.$insert({
              data: {
                coin: this.coinSymbol,
                currency: this.selectedCurrency.code,
                updated: +new Date(),
                data,
              },
            });
            return false;
          }
          return true;
        };

        const whereLatest = (record, item) => {
          return (
            record.coin === item.coin
            && record.currency === item.currency
          );
        };

        const latest = latestPrice[this.coinSymbol][this.selectedCurrency.code];
        if (checkPriceExists(this.coinSymbol, latest)) {
          Latest.$update({
            where: (record) => {
              return whereLatest(record, {
                coin: this.coinSymbol,
                currency: this.selectedCurrency.code,
              });
            },
            data: {
              updated: +new Date(),
              data: latestPrice[this.coinSymbol][this.selectedCurrency.code],
            },
          });
        }
      } catch (err) {
        this.errorHandler(err);
      }

      this.loading = false;
      this.showChart = true;
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
