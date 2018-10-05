<template>
  <section>
    <div>
      <h1>CryptoWallet Setup!</h1>
      <span>This is your seed for the love of satoshi write it down!</span>
      <div>{{ seed }}</div>
    </div>
  </section>
</template>

<script>
import bip39 from 'bip39';
import bcrypt from 'bcryptjs';

export default {

  data() {
    return {
      seed: null,
    };
  },

  beforeCreate() {

  },

  created() {

  },

  beforeMount() {
    this.seed = bip39.generateMnemonic();
    console.log(this);
    console.log(bcrypt.genSaltSync(42));
    this.$store.dispatch('wallet/setSalt', bcrypt.genSaltSync(42));
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

  },

};

</script>

<style scoped>

</style>
