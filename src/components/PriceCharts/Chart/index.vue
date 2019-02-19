<script>
import { Line, mixins } from 'vue-chartjs';

const { reactiveProp } = mixins;

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: {
    options: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      _chart: '',
    };
  },
  computed: {
    gradient() {
      const newGradient = this.$refs.canvas.getContext('2d').createLinearGradient(0, 0, 0, 450);

      newGradient.addColorStop(0, 'rgba(250, 188, 87, 0.5)'); // show this color at 0%;
      newGradient.addColorStop(0.3, 'rgba(250, 188, 87, 0.25)'); // show this color at 50%
      newGradient.addColorStop(1, 'rgba(250, 188, 87, 0)'); // show this color at 100%

      return newGradient;
    },
  },
  watch: {
    chartData: {
      handler() {
        const chart = this.chartData;
        chart.datasets[0].backgroundColor = this.gradient;
        chart.datasets[1].backgroundColor = this.gradient;
        chart.datasets[2].backgroundColor = this.gradient;
        this.renderChart(chart, this.options);
        this.chart = this.$data._chart;
        this.newLegend();
      },
    },
  },
  mounted() {
    const chart = this.chartData;
    chart.datasets[0].backgroundColor = this.gradient;
    chart.datasets[1].backgroundColor = this.gradient;
    chart.datasets[2].backgroundColor = this.gradient;
    this.renderChart(chart, this.options);
    this.chart = this.$data._chart;
    this.newLegend();
  },
  methods: {
    newLegend() {
      this.$emit('legendHtml', this.chart);
    },
  },

};
</script>

<style>

</style>
