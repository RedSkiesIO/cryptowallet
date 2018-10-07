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
import { mapState } from 'vuex';
import PinPad from '../components/Auth/PinPad.vue';

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
      salt: state => state.account.salt,
      pinHash: state => state.account.pinHash,
      pinLength: state => state.account.pinLength,
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
    console.log(this.$acmwcrypto);
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

    attemptUnlock() {
      if (this.$acmwcrypto.bcryptCompareString(this.pin.join(''), this.pinHash) === true) {
        this.$router.push({ path: '/wallet/balance' });
      }
    },
  },

};

</script>

<style scoped>

</style>
