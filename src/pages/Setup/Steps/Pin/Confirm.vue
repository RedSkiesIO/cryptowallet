<template>
  <div>
    <h1 class="setup">Pin Confirmation</h1>
    <h4 class="setup">Confirm your pin</h4>
    <pin-pad mode="pin-confirm"/>
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
      accountType: state => state.setup.accountType,
      id: state => parseInt(state.route.params.id, 10),
    }),
  },
  methods: {
    validatePin() {
      const pinHashConfirm = this.$CWCrypto.bcryptHashString(this.pinConfirm.join(''), this.salt);
      if (this.pinHash === pinHashConfirm) {
        if (this.accountType === 'restored') this.$router.push({ path: `/setup/${this.id + 2}` });
        this.$router.push({ path: `/setup/${this.id + 1}` });
      }
    },
  },
};

</script>

<style scoped>

</style>
