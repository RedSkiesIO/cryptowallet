<template>
  <div>
    <pin-pad />
    <q-btn
      :label="$t('unlock')"
      style="color: goldenrod;"
      outline
      @click="attemptUnlock"
    />
  </div>
</template>

<script>
import PinPad from '@/components/Auth/PinPad';

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
     * Compares bcrypt pin string to try and unlock an account
     * @TODO at moment hard coded to first account
     */
    attemptUnlock() {
      const accounts = this.$store.getters['entities/account/query']().get();
      if (this.$CWCrypto.bcryptCompareString(this.pin.join(''), accounts[0].pinHash) === true) {
        this.$router.push({ path: '/wallet/wallet' });
      }
    },
  },

};

</script>

<style scoped>

</style>
