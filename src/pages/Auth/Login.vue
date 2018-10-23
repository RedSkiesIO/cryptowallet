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
     * @TODO document james.
     */
    attemptUnlock() {
      // @TODO at moment hard coded to first account,
      // need ability to choose which account you're login into.
      const accounts = this.$store.getters['entities/account/query']().get();
      if (this.$acmwcrypto.bcryptCompareString(this.pin.join(''), accounts[0].pinHash) === true) {
        this.$router.push({ path: '/wallet/balance' });
      }
    },
  },

};

</script>

<style scoped>

</style>
