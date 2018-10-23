<template>
  <keyboard
    :layouts="[
      '123|456|789|0|{delete:backspace}{!@£:goto:1}',
      '!@#|?%^|&()|*|{delete:backspace}{123:goto:0}',
    ]"
    @input="inputPin"
  />
</template>

<script>
import { mapState } from 'vuex';
import keyboard from 'vue-keyboard';

export default {

  components: {
    keyboard,
  },

  data() {
    return {
      pin: [],
    };
  },

  computed: {
    ...mapState({
      minLength: state => state.settings.pin.minLength,
    }),
  },

  // beforeCreate() {

  // },

  // created() {

  // },

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
     * Emits pin code to parent components.
     * @param pin
     */
    inputPin(pin) {
      console.log(pin);
      console.log(this);
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
