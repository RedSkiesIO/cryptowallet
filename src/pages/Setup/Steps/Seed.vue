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
        @click="nextStep"
      />
    </div>
  </section>
</template>

<script>
import bip39 from 'bip39';

export default {

  data() {
    return {
      seed: bip39.generateMnemonic(),
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
    nextStep() {
      this.$store.dispatch('setup/setSeed', this.seed).then(this.$router.push({ path: '/setup/pin' }));
    },
  },

};

</script>

<style scoped>

</style>
