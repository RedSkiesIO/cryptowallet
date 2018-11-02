<template>
  <div>
    <div>{{ $t('repeatPin') }}</div>
    <astrix />
    <pin-pad />
  </div>
</template>

<script>
import PinPad from '@/components/Auth/PinPad';
import Astrix from '@/components/Auth/Astrix';
import mixin from '@/pages/Setup/Steps/Pin/Mixin';

export default {

  components: {
    PinPad,
    Astrix,
  },

  mixins: [mixin],

  methods: {

    validate() {
      try {
        this.validatePinLength(this.pin);
      } catch (error) {
        this.$toast.create(10, this.$t('pinLengthError'), 500);
        return false;
      }

      const pinHashConfirm = this.$CWCrypto.bcryptHashString(this.pin.join(''), this.salt);

      try {
        this.validateHashedPinsMatch(this.pinHash, pinHashConfirm);
      } catch (error) {
        this.$toast.create(10, this.$t('pinMatch'), 500);
        return false;
      }

      return true;
    },

    validatePinLength(pin) {
      if (pin.length < 6) {
        throw new Error();
      } else {
        return true;
      }
    },

    validateHashedPinsMatch(pinHash, pinHashConfirm) {
      if (pinHash !== pinHashConfirm) {
        throw new Error();
      } else {
        return true;
      }
    },
  },
};

</script>

<style scoped>

</style>
