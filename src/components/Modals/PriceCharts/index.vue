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
          // this.loadData();
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
