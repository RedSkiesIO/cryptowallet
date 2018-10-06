<template>
  <div>
    <div>pin setup page</div>
    <keyboard
      v-model="pin"
      layouts="0123456789"
      @input="hashPin"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import keyboard from 'vue-keyboard';
import bcrypt from 'bcryptjs';

export default {

  components: { keyboard },

  data() {
    return {
      pin: '',
    };
  },

  computed: {
    ...mapState({
      salt: state => state.account.salt,
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
    hashPin(plainPin) {
      const hash = bcrypt.hashSync(plainPin, this.salt);
      console.log(hash);
    },
  },

};

</script>

<style scoped>
</style>
