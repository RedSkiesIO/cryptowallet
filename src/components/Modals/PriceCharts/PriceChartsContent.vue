<template>
  <div>
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
            v-if="latestPrice.data.VOLUME24HOURTO !== 0"
            class="col-6"
          >
            {{ $t('volume24h') }} {{ selectedCurrency.code }}
          </div>
        </div>
        <div class="row price">
          <div class="col-6">
            {{ selectedCurrency.symbol }}{{ latestPrice.data.PRICE.toFixed(2) }}
          </div>
          <div
            v-if="latestPrice.data.VOLUME24HOURTO !== 0"
            class="col-6"
          >
            {{ selectedCurrency.symbol }}{{ latestPrice.data.VOLUME24HOURTO.toFixed(0) }}
          </div>
        </div>
        <div
          :style="{ color: percentColor}"
          class="row"
        >
          <div class="col-6">
            {{ latestPrice.data.CHANGEPCT24HOUR.toFixed(2) }}%
          </div>
        </div>
      </div>
      <PriceChart
        v-if="(chartDataExists || showChart)"
        :gradient="gradientStroke"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import PriceChart from '@/components/PriceCharts/ChartContainer';
import Spinner from '@/components/Spinner';
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
      gradientStroke: '',
      loading: false,
      showChart: false,
    };
  },
  computed: {
    ...mapState({
      id: (state) => { return state.route.params.id; },
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
      return prices;
    },
    percentColor() {
      const priceChange = this.latestPrice.data.CHANGEPCT24HOUR;
      if (priceChange > 0) {
        return '#00FF00';
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
  async mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      this.showChart = false;
      this.loading = true;

      try {
        await this.backEndService.loadCoinPriceData(this.coinSymbol);
      } catch (err) {
        this.errorHandler(err);
      }

      this.loading = false;
      this.showChart = true;
    },
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="scss">
.close-btn .q-btn__content .modal-layout-wrapper{
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
