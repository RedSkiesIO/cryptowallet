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
import keyboard from 'vue-keyboard';

export default {

  components: {
    keyboard,
  },

  data() {
    return {};
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
     */
    inputPin(pin) {
      this.$root.$emit('inputPin', pin);
    },
  },

};

</script>

<style scoped>

</style>
