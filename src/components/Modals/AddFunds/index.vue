<template>
  <div v-if="addFundsModalOpened">
    <div
      v-if="showCloseProvider"
      class="close-provider"
    >
      <q-btn
        icon="close"
        color="blueish"
        size="lg"
        class="icon-btn icon-btn-right absolute"
        flat
        @click="closeProvider"
      />
    </div>
    <q-dialog
      v-model="addFundsModalOpened"
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
      content-class="light-modal"
    >
      <AddFundsContent
        @loading="loading"
        @setProvider="setPaymentProvider"
      />
    </q-dialog>

    <q-inner-loading
      color="primary"
      :showing="visible"
    />
  </div>
</template>

<script>
import AddFundsContent from './AddFundsContent';

export default {
  name: 'AddFunds',
  components: {
    AddFundsContent,
  },
  data() {
    return {
      // transak: null,
      visible: false,
      provider: null,
    };
  },
  computed: {
    addFundsModalOpened: {
      get() {
        return this.$store.state.modals.addFundsModalOpened;
      },
      set(value) {
        this.$store.dispatch('modals/setAddFundsModalOpened', value);
      },
    },
    showCloseProvider() {
      if (this.provider && this.provider.isInitialised) {
        return true;
      }
      return false;
    },
  },
  watch: {
    $route: {
      handler(to) {
        if (to.name === 'addFunds' || to.name === 'addFundsSingle') {
          this.$store.dispatch('modals/setAddFundsModalOpened', true);
        } else if ((to.name === 'wallet' || to.name === 'walletSingle')) {
          this.$store.dispatch('modals/setAddFundsModalOpened', false);
        }
      },
    },
    addFundsModalOpened: {
      handler(newVal, oldVal) {
        if (oldVal === true && newVal === false) {
          if (this.$store.state.route.name === 'addFunds' || this.$store.state.route.name === 'addFundsSingle') { this.$router.go(-1); }
        }
      },
    },
  },
  methods: {
    loading(val) {
      this.visible = val;
    },

    setPaymentProvider(val) {
      this.provider = val;
    },

    closeProvider() {
      if (this.provider) { this.provider.closeRequest(); }
    },
  },
};
</script>

<style scoped>
.q-inner-loading {
  z-index: 999;
  background: white;
}
.close-provider {
  position: absolute;
  z-index: 999;
  top: 2px;
  right: 2px;
}
</style>
