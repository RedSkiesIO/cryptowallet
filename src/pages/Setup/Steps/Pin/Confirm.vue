<template>
  <div>
    <h1 class="setup">
      {{ $t('pinConfirmationTitle') }}
    </h1>
    <h4 class="setup">
      {{ $t('confirmPin') }}
    </h4>
    <PinPad mode="pin-confirm" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import PinPad from '@/components/Auth/PinPad';

export default {
  components: {
    PinPad,
  },
  computed: {
    ...mapState({
      pin: (state) => { return state.setup.pinArray; },
      pinConfirm: (state) => { return state.setup.pinConfirmArray; },
      salt: (state) => { return state.setup.salt; },
      minLength: (state) => { return state.settings.pin.minLength; },
      pinHash: (state) => { return state.setup.pinHash; },
      pinHashConfirm: (state) => { return state.setup.pinHashConfirm; },
      accountType: (state) => { return state.setup.accountType; },
      id: (state) => { return parseInt(state.route.params.id, 10); },
      delay: (state) => { return state.settings.delay; },
    }),
  },
  methods: {
    validatePin() {
      if (this.pin.join('') === this.pinConfirm.join('')) {
        this.$router.push({ path: `/setup/${this.id + 1}` });
      } else {
        this.$toast.create(10, this.$t('wrongPin'), this.delay.normal, 'top');
      }
    },
  },
};

</script>

<style scoped>

</style>
