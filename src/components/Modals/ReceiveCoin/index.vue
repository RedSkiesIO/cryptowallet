<template>
  <div>
    <q-dialog
      v-model="receiveCoinModalOpened"
      persistent
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
      content-class="light-modal"
    >
      <Receive />
    </q-dialog>
  </div>
</template>

<script>
import Receive from '@/components/Wallet/ReceiveCoin';

export default {
  name: 'ReceiveCoin',
  components: {
    Receive,
  },
  computed: {
    receiveCoinModalOpened: {
      get() {
        return this.$store.state.modals.receiveCoinModalOpened;
      },
      set(value) {
        this.$store.dispatch('modals/setReceiveCoinModalOpened', value);
      },
    },
  },
  watch: {
    $route: {
      handler(to) {
        if (to.name === 'receiveCoin' || to.name === 'receiveCoinSingle') {
          this.$store.dispatch('modals/setReceiveCoinModalOpened', true);
        } else if ((to.name === 'wallet' || to.name === 'walletSingle')) {
          this.$store.dispatch('modals/setReceiveCoinModalOpened', false);
        }
      },
    },
    receiveCoinModalOpened: {
      handler(newVal, oldVal) {
        if (oldVal === true && newVal === false) {
          if (this.$store.state.route.name === 'receiveCoin' || this.$store.state.route.name === 'receiveCoinSingle') { this.$router.go(-1); }
        }
      },
    },
  },
};
</script>

<style>
</style>
