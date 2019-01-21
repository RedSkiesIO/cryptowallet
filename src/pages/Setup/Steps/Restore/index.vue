<template>
  <div>
    <div class="container">
      <div class="restore-header">
        <h1 class="setup">{{ $t('restoreAccount') }}</h1>
        <p class="setup"> {{ $t('restoreDescription') }}</p>
      </div>

      <div class="restore-input-wrapper">
        <q-input
          v-model="seedPhrase"
          type="textarea"
          color="blueish"
          float-label="Backup Phrase"
          rows="1"
          inverted
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
      id: state => parseInt(state.route.params.id, 10),
    }),
  },
  methods: {
    validate() {
      const seedPhrase = this.seedPhrase.trim().split(' ');

      if (seedPhrase.length !== 12) {
        this.$toast.create(10, this.$t('notEnoughWords'), 500);
        return false;
      }

      if (!bip39.validateMnemonic(seedPhrase.join(' '))) {
        this.$toast.create(10, 'Invalid seed phrase', 500);
        return false;
      }

      const accounts = this.$store.getters['entities/account/query']().get();
      const seedAlreadyInUse = accounts.find(account => account.seed === seedPhrase);

      if (seedAlreadyInUse) {
        this.$toast.create(10, this.$t('accountAlreadyImported'), 500);
        return false;
      }
      this.$store.dispatch('setup/setSeed', seedPhrase);
      this.$router.push({ path: `/setup/${this.id + 1}` });
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
