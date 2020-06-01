<template>
  <div v-if="addFundsModalOpened">
    <q-dialog
      v-model="addFundsModalOpened"
      persistent
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
      content-class="light-modal"
    >
      <AddFundsContent @loading="loading" />
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
  },
};
</script>

<style scoped>
.q-inner-loading {
  z-index: 999;
  background: white;
}
</style>
