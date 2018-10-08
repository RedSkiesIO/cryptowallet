<template>
  <Keyboard
    :layouts="[
      '123|456|789|0|{delete:backspace}{!@£:goto:1}',
      '!@#|?%^|&()|*|{delete:backspace}{123:goto:0}',
    ]"
    @input="inputPin"
  />
</template>

<script>
import { mapState } from 'vuex';
import Keyboard from '%/vue-keyboard';

export default {

  components: {
    Keyboard,
  },

  data() {
    return {
      pin: [],
    };
  },

  computed: {
    ...mapState({
      minLength: state => state.account.minLength,
    }),
  },

  beforeCreate() {

  },

  created() {

  },

  beforeMount() {

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
     * Emits pincode to parent components.
      * @param {*} pin
     */
    inputPin(pin) {
      if (pin === '') {
        this.pin.pop();
      } else {
        this.pin.push(pin);
      }
      if (this.pin.length >= this.minLength) {
        this.$root.$emit('inputPin', this.pin);
      }
    },
  },

};

</script>

<style scoped>

</style>
