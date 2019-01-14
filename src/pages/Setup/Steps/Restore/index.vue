<template>
  <div class="container">
    <div>
      <h1 class="setup">{{ $t('restoreAccount') }}</h1>
    </div>
    <div class="account-name-input-wrapper">
      <q-input
        :float-label="$t('enterSeed')"
        v-model="seedPhrase"
        inverted
        clearable
        color="blueish"
      />
    </div>
    <div class="btns-wrapper">
      <q-btn
        color="secondary"
        label="Confirm"
        @click="validate"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Restore',
  data() {
    return {
      seedPhrase: [],
    };
  },
  computed: {
    ...mapState({
      id: state => parseInt(state.route.params.id, 10),
    }),
  },
  methods: {
    validate() {
      if (!this.seedPhrase.trim().split(/\s+/g).length === 12) return false;

      const accounts = this.$store.getters['entities/account/query']().get();
      const seedAlreadyInUse = accounts.find(account => account.seed === this.seedPhrase.split(' '));

      if (seedAlreadyInUse) {
        this.$toast.create(10, this.$t('accountNameTaken'), 500);
        return false;
      }
      console.log('this.seedPhrase:', this.seedPhrase.split(' '));
      this.$store.dispatch('setup/setSeed', this.seedPhrase.split(' '));
      this.$router.push({ path: `/setup/${this.id + 1}` });
      return true;
    },
  },
};

</script>

<style scoped>
.account-name-input-wrapper {
  margin-top: 1rem;
  padding: 0 1em;
}
</style>
