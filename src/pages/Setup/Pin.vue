<template>
  <div>
    <div>pin setup page</div>
    <pin-pad />
    <q-btn
      v-if="pin.length >= 6"
      :label="$t('continue')"
      style="color: goldenrod;"
      outline
      @click="hashPin"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import PinPad from '../../components/Auth/PinPad.vue';

export default {

  components: {
    PinPad,
  },

  data() {
    return {
      pin: [],
    };
  },

  computed: {
    ...mapState({
      salt: (state) => { return state.account.salt; },
      minLength: (state) => { return state.account.minLength; },
    }),
  },

  beforeCreate() {

  },

  created() {

  },

  beforeMount() {
    this.pinInputListener();
  },

  mounted() {

  },

  beforeUpdate() {

  },

  updated() {

  },

  beforeDestroy() {

  },

  destroyed() {

  },

  methods: {

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
     */
    hashPin() {
      const pinHash = this.$acmwcrypto.bcryptHashString(this.pin.join(''), this.salt);
      console.log(pinHash);
      this.$store.dispatch('account/setPinHash', {
        pinHash,
        pinLength: this.pin.length,
      }).then(this.$router.push({ path: '/' }));
    },
  },
};

</script>

<style scoped>
</style>
