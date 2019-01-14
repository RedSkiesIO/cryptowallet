<template>
  <div>
    <h1 class="setup">Pin Setup</h1>
    <h4 class="setup">Choose your pin</h4>
    <pin-pad mode="pin-setup"/>
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
      pin: state => state.setup.pinArray,
      pinConfirm: state => state.setup.pinConfirmArray,
      salt: state => state.setup.salt,
      minLength: state => state.settings.pin.minLength,
      pinHash: state => state.setup.pinHash,
      pinHashConfirm: state => state.setup.pinHashConfirm,
    }),
  },
};
</script>

<style scoped>

</style>
