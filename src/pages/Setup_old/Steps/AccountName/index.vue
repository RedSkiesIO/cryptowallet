<template>
  <div class="container">
    <div>
      <h1>{{ $t('newAccount') }}</h1>
    </div>
    <div class="account-name-input-wrapper">
      <q-input
        :float-label="$t('accountName')"
        v-model="accountName"
        inverted
        clearable
        color="blueish"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'AccountName',
  data() {
    return {
      accountName: '',
    };
  },
  watch: {
    accountName: {
      handler(value) {
        if (value.length > 0) {
          this.$root.$emit('showNext');
        } else {
          this.$root.$emit('hideNext');
        }
      },
    },
  },
  methods: {
    validate() {
      if (this.accountName.length === 0) return false;
      const accounts = this.$store.getters['entities/account/query']().get();

      const nameAlreadyInUse = accounts.find(account => account.name === this.accountName);

      if (nameAlreadyInUse) {
        this.$toast.create(10, this.$t('accountNameTaken'), 500);
        return false;
      }

      this.$store.dispatch('setup/setAccountName', this.accountName);
      return true;
    },
  },
};

</script>

<style scoped>
.account-name-input-wrapper {
  margin-top: 1rem;
}

</style>
