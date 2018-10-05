<template>
  <div>
    <keyboard
      v-model="pin"
      layouts="0123456789"
      @input="hashPin"
    />
  </div>
</template>

<script>
import keyboard from 'vue-keyboard';
import bcrypt from 'bcryptjs';

export default {

  components: { keyboard },

  data() {
    return {
      pin: '',
      salt: '',
    };
  },

  beforeCreate() {

  },

  created() {
    this.salt = bcrypt.genSaltSync(10);
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
