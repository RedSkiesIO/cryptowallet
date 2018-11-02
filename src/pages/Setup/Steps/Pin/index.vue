<template>
  <div>
    <div id="pinTitle_id">enter your pin</div>
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
      if (this.pin.length >= this.minLength) {
        this.$store.dispatch('setup/setPinHash', this.$CWCrypto.bcryptHashString(this.pin.join(''), this.salt));
      } else {
        this.$toast.create(10, this.$t('pinLengthError'), 500);
        return false;
      }
      return true;
    },
  },
};
</script>

<style scoped>
 #pinTitle_id {
  text-align: center;
  font-size: 22px;
  font-weight: bold;
 }
</style>
