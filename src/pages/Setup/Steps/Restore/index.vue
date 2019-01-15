<template>
  <div class="container">

    <div class="restore-input-wrapper">
      <div class="restore-header">
        <h2>{{ $t('restoreAccount') }}</h2>
        <p class="justify-center"> {{ $t('restoreDescription') }}</p>

      </div>
      <template v-for="n in textInputs">
        <div
          :key="n"
          class="row">
          <div class="col-6">
            <q-input
              v-model.trim="seedPhrase[n-1]"
              :prefix="(n)+'. '"
              class="seed-input"
              dark
              type="password"
            />
          </div>
          <div class="t col-6">
            <q-input
              v-model.trim="seedPhrase[n]"
              :prefix="(n+1)+'. '"
              class="seed-input"
              dark
              type="password" />
          </div>
        </div>
      </template>

    </div>
    <div class="btns-wrapper">
      <q-btn
        color="secondary"
        label="Restore Wallet"
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
      seedPhrase: [],
      textInputs: [1, 3, 5, 7, 9, 11],
    };
  },
  computed: {
    ...mapState({
      id: state => parseInt(state.route.params.id, 10),
    }),
  },
  methods: {
    validate() {
      if (this.seedPhrase.length !== 12) {
        this.$toast.create(10, this.$t('notEnoughWords'), 500);
        return false;
      }

      if (!bip39.validateMnemonic(this.seedPhrase.join(' '))) {
        this.$toast.create(10, 'Invalid seed phrase', 500);
        return false;
      }

      const accounts = this.$store.getters['entities/account/query']().get();
      const seedAlreadyInUse = accounts.find(account => account.seed === this.seedPhrase);

      if (seedAlreadyInUse) {
        this.$toast.create(10, this.$t('accountAlreadyImported'), 500);
        return false;
      }
      this.$store.dispatch('setup/setSeed', this.seedPhrase);
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

.restore-header{
    margin-bottom: 1em;
    text-align: center;
}
.restore-header h2{
    margin-bottom: -0.5em;
    text-align: center;
}

.seed-input{
    margin-right: 1em;
    margin-bottom: 1em;
    font-size: 'small';
}

.seed-input .input{
    font-size: 'small';
    color: white;
}
.seed-input .input-target{
    font-size: 'small';
    color: white;
}

</style>
