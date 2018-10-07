<template>
  <div>
    <pin-pad/>
  </div>
</template>

<script>
import bcrypt from 'bcryptjs';
import PinPad from '../components/Auth/PinPad.vue';

export default {

  components: {
    PinPad,
  },

  data() {
    return {
      pin: '',
    };
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
    hashPin(plainPin) {
      const hash = bcrypt.hashSync(plainPin, this.salt);
      console.log(hash);
    },
  },

};

</script>

<style scoped>

</style>
