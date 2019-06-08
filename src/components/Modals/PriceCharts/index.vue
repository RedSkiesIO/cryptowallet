<template>
  <div>
    <q-dialog
      v-model="priceChartModalOpened"
      persistent
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
      content-class="dark-modal"
    >
      <PriceChartsContent />
    </q-dialog>
  </div>
</template>

<script>
import PriceChartsContent from './PriceChartsContent';

export default {
  name: 'PriceCharts',
  components: {
    PriceChartsContent,
  },
  computed: {
    priceChartModalOpened: {
      get() {
        return this.$store.state.modals.priceChartModalOpened;
      },
      set(value) {
        this.$store.dispatch('modals/setPriceChartModalOpened', value);
      },
    },
  },
  watch: {
    $route: {
      handler(to) {
        if (to.name === 'coinPrices' || to.name === 'coinSinglePrices') {
          this.$store.dispatch('modals/setPriceChartModalOpened', true);
        } else {
          this.$store.dispatch('modals/setPriceChartModalOpened', false);
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
};
</script>

<style>
</style>
