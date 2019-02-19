<template>
  <div class="chart-container">
    <div class="row justify-center">
      <q-btn
        class="chart-button"
        color="secondary"
        label="24H"
        @click="onClick(0)"
      />
      <q-btn
        class="chart-button"
        color="secondary"
        label="1W"
        @click="onClick(1)"
      />
      <q-btn
        class="chart-button"
        color="secondary"
        label="1M"
        @click="onClick(2)"
      />
    </div>

    <Chart
      v-if="chartData"
      :chart-data="chartData"
      :options="options"
      @legendHtml="updateLegend"
    />
  </div>
</template>

<script>
import Chart from '@/components/PriceCharts/Chart';
import { mapState } from 'vuex';
import Prices from '@/store/prices';
import Coin from '@/store/wallet/entities/coin';

export default {
  name: 'ChartContainer',
  components: { Chart },
  data() {
    return {
      loaded: false,
      legendMarkup: '',
      newChart: 'test',
      gradient: '',
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
    chartStyles() {
      return {
        position: 'relative',
      };
    },
    dayData() {
      return Prices.find([`${this.coinSymbol}_${this.selectedCurrency.code}_day`]);
    },
    weekData() {
      return Prices.find([`${this.coinSymbol}_${this.selectedCurrency.code}_week`]);
    },
    monthData() {
      return Prices.find([`${this.coinSymbol}_${this.selectedCurrency.code}_month`]);
    },
    chartData() {
      return {
        datasets: [{
          label: '24H',
          borderColor: '#fabc57',
          borderWidth: 3,
          pointRadius: 0,
          backgroundColor: 'black',
          data: this.dayData.data,
        },
        {
          label: '1W',
          borderColor: '#fabc57',
          borderWidth: 3,
          pointRadius: 0,
          backgroundColor: 'black',
          hidden: true,
          data: this.weekData.data,
        },
        {
          label: '1M',
          borderColor: '#fabc57',
          borderWidth: 3,
          pointRadius: 0,
          backgroundColor: 'black',
          hidden: true,
          data: this.monthData.data,
        },
        ],

      };
    },
    options() {
      return {
        animations: {
          duration: 2000,
        },
        layout: {
          padding: {
            top: 10,
          },
        },
        scales: {
          xAxes: [{
            type: 'time',
            // time: {
            //   stepSize: 4,
            // },
            ticks: {
              minRotation: '45',
              fontColor: '#78d2e6',
              padding: 15,

            },
            gridLines: {
              display: false,
            },
          }],
          yAxes: [{
            position: 'left',
            color: '#78d2e6',
            ticks: {
              fontColor: '#78d2e6',
              callback: (value) => { return `£${value}`; },
            },
          }],
        },
        legend: {
          display: false,
        },

      };
    },
  },

  mounted() {
    this.loaded = false;


    this.loaded = true;
  },
  methods: {
    updateLegend(chart) {
      this.newChart = chart;
    },

    onClick(index) {
      const ci = this.newChart;
      if (index === 0) {
        [ci.getDatasetMeta(1),
          ci.getDatasetMeta(2)].forEach((meta) => {
          meta.hidden = true;
        });
        const selected = ci.getDatasetMeta(0);
        selected.hidden = false;
        ci.update();
      } else if (index === 1) {
        [ci.getDatasetMeta(0),
          ci.getDatasetMeta(2)].forEach((meta) => {
          meta.hidden = true;
        });
        const selected = ci.getDatasetMeta(1);
        selected.hidden = false;
        ci.update();
      } else {
        [ci.getDatasetMeta(0),
          ci.getDatasetMeta(1)].forEach((meta) => {
          meta.hidden = true;
        });
        const selected = ci.getDatasetMeta(2);
        selected.hidden = false;
        ci.update();
      }
    },
  },
};
</script>

<style>
.chart-button{
    margin-right: 10px;
    margin-left: 10px;
    margin-bottom: 15px;
    margin-top: 10px;
    min-height: 1.75em;
}
.chart-container{
    margin: 0;
}

</style>
