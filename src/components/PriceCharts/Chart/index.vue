<script>
// cannot fix this, _chart is coming from vue-chartjs
/* eslint-disable vue/no-reserved-keys */
/* eslint-disable no-underscore-dangle */
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
    chartData: {
      type: Object,
    },
  },
  data() {
    return {
      _chart: '',
    };
  },
  computed: {
    gradient() {
      const colour = 450;
      const newGradient = this.$refs.canvas.getContext('2d').createLinearGradient(0, 0, 0, colour);
      const transparency = 0.3;
      newGradient.addColorStop(0, 'rgba(250, 188, 87, 0.5)');
      newGradient.addColorStop(transparency, 'rgba(250, 188, 87, 0.25)');
      newGradient.addColorStop(1, 'rgba(250, 188, 87, 0)');

      return newGradient;
    },
  },
  watch: {
    chartData: {
      handler() {
        this.loadChart();
      },
    },
  },
  mounted() {
    this.loadChart();
  },
  methods: {
    newLegend() {
      this.$emit('legendHtml', this.chart);
    },
    loadChart() {
      this.chartData.datasets.forEach((set) => {
        set.backgroundColor = this.gradient;
      });
      this.renderChart(this.chartData, this.options);
      this.chart = this.$data._chart;
      this.newLegend();
    },
  },
};
</script>
<style>
</style>
