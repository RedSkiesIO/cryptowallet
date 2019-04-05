<template>
  <div>
    <div class="container">
      <div class="restore-header">
        <h1 class="setup">
          {{ $t('restoreAccount') }}
        </h1>
        <p class="setup">
          {{ $t('restoreDescription') }}
        </p>
      </div>

      <div class="restore-input-wrapper">
        <q-input
          v-model="seedPhrase"
          type="textarea"
          float-label="Backup Phrase"
          outlined
          dark
          color="primary"
        />
      </div>
    </div>
    <div class="btns-wrapper">
      <q-btn
        color="yellow"
        text-color="blueish"
        label="Next"
        @click="validate"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import bip39 from 'bip39';

export default {
  name: 'Restore',
  data() {
    return {
      seedPhrase: '',
    };
  },
  computed: {
    ...mapState({
      delay: (state) => { return state.settings.delay; },

    }),
  },
  methods: {
    validate() {
      const seedLength = 12;
      const seedPhrase = this.seedPhrase.trim().split(' ');

      if (seedPhrase.length !== seedLength) {
        this.$toast.create(10, this.$t('notEnoughWords'), this.delay.normal);
        return false;
      }

      if (!bip39.validateMnemonic(seedPhrase.join(' '))) {
        this.$toast.create(10, this.$t('invalidSeedPhrase'), this.delay.normal);
        return false;
      }

      this.$store.dispatch('setup/setSeed', seedPhrase);
      this.$router.push({ path: '/setup/4' });
      return true;
    },
  },
};

</script>

<style scoped>
.restore-input-wrapper {
  margin-top: 1rem;
  padding: 0 1em;
}
</style>
