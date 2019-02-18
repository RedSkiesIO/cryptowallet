<template>
  <div>
    <h1 class="setup">
      Pin Setup
    </h1>
    <h4 class="setup">
      Set your pin. Minimum 6 digits asd.
    </h4>
    <PinPad mode="pin-setup" />
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
    }),
  },
};
</script>

<style scoped>

</style>
