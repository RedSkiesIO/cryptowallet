<template>
  <div>
    <div>pin setup page</div>
    <pin-pad />
    <q-btn
      v-if="pin.length >= minLength"
      :label="$t('continue')"
      style="color: goldenrod;"
      outline
      @click="nextStep"
    />
  </div>
</template>

<script>
import bcrypt from 'bcryptjs';
import { mapState } from 'vuex';
import PinPad from '../../../components/Auth/PinPad.vue';

export default {

  components: {
    PinPad,
  },

  data() {
    return {
      pin: [],
      salt: bcrypt.genSaltSync(10),
    };
  },

  computed: {
    ...mapState({
      minLength: state => state.settings.pin.minLength,
    }),
  },

  // beforeCreate() {

  // },

  created() {
    this.pinInputListener();
  },

  // beforeMount() {

  // },

  // mounted() {

  // },

  // beforeUpdate() {

  // },

  // updated() {

  // },

  // beforeDestroy() {

  // },

  // destroyed() {

  // },

  methods: {
    /**
     * @TODO document james
     */
    nextStep() {
      this.$store.dispatch('setup/setSalt', this.salt).then(() => {
        this.hashPin(this.pin.join(''), this.salt).then((hashedPing) => {
          if (hashedPing) {
            this.$router.push({ path: '/setup/complete' });
          }
        });
      });
    },

    /**
     * adds or removes pin input event to pin arr.
     */
    pinInputListener() {
      this.$root.$on('inputPin', (pinArr) => {
        this.pin = pinArr;
      });
    },

    /**
     * Hashes pin and stores in account store.
     * @param pin
     * @param salt
     * @returns {Promise<T | never>}
     */
    hashPin(pin, salt) {
      const pinHash = this.$acmwcrypto.bcryptHashString(pin, salt);
      return this.$store.dispatch('setup/setPinHash', {
        pinHash,
        pinLength: this.pin.length,
      }).then(() => pinHash);
    },
  },
};

</script>

<style scoped>
</style>
