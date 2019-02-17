<template>
  <section>
    <div>
      <h1>{{ $t('setupTitle') }}</h1>
      <span>This is your seed for the love of satoshi write it down!</span>
      <div>{{ seed }}</div>
      <q-btn
        :label="$t('continue')"
        style="color: goldenrod;"
        outline
        @click="$router.push({ path: '/setup/pin' })"
      />
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
    this.$store.dispatch('account/setSalt', bcrypt.genSaltSync(10));
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
    continue() {

    },
  },

};

</script>

<style scoped>

</style>
