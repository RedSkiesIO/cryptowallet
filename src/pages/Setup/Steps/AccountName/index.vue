<template>
  <div class="container">
    <div>
      <h1 class="setup">
        {{ $t('setAccountName') }}
      </h1>
    </div>
    <div class="account-name-input-wrapper">
      <q-input
        v-model="accountName"
        :float-label="$t('accountName')"
        inverted
        clearable
        color="blueish"
      />
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

export default {
  name: 'AccountName',
  data() {
    return {
      accountName: '',
    };
  },
  computed: {
    ...mapState({
      id: (state) => { return parseInt(state.route.params.id, 10); },
    }),
  },
  methods: {
    validate() {
      if (this.accountName.length === 0) { return false; }
      const accounts = this.$store.getters['entities/account/query']().get();
      const nameAlreadyInUse = accounts.find((account) => {
        return account.name === this.accountName;
      });

      if (nameAlreadyInUse) {
        this.$toast.create(10, this.$t('accountNameTaken'), 500);
        return false;
      }

      this.$store.dispatch('setup/setAccountName', this.accountName);
      this.$root.$emit('termsModalOpened', true);
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
