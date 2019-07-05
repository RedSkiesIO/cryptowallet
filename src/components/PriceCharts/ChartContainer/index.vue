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

export default {
  name: 'ChartContainer',
  components: { Chart },
  props: {
    datasets: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      newChart: '',
    };
  },
  computed: {
    selectedCurrency() {
      return this.$store.state.settings.selectedCurrency;
    },
    chartData() {
      return {
        datasets: [{
          label: '24H',
          borderColor: '#fabc57',
          borderWidth: 3,
          pointRadius: 0,
          backgroundColor: 'black',
          data: this.datasets[0].data,
        },
        {
          label: '1W',
          borderColor: '#fabc57',
          borderWidth: 3,
          pointRadius: 0,
          backgroundColor: 'black',
          hidden: true,
          data: this.datasets[1].data,
        },
        {
          label: '1M',
          borderColor: '#fabc57',
          borderWidth: 3,
          pointRadius: 0,
          backgroundColor: 'black',
          hidden: true,
          data: this.datasets[2].data,
        }],
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
              callback: (value) => { return `${this.selectedCurrency.symbol}${value}`; },
            },
          }],
        },
        legend: {
          display: false,
        },

      };
    },
  },
  methods: {
    updateLegend(chart) {
      this.newChart = chart;
    },

    onClick(index) {
      const chart = this.newChart;
      [0, 1, 2].forEach((i) => {
        if (i !== index) {
          chart.getDatasetMeta(i).hidden = true;
        }
      });
      chart.getDatasetMeta(index).hidden = false;
      chart.update();
      this.$emit('update', index);
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
