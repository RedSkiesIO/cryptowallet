<template>
  <div class="container">
    <div>
      <h1 class="setup">
        {{ $t('newAccount') }}
      </h1>
    </div>
    <div class="btns-wrapper">
      <q-btn
        color="secondary"
        label="Create New Seed"
        @click="validate(1)"
      />
      <q-btn
        color="secondary"
        label="Restore From Seed"
        @click="validate(2)"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'AccountType',
  data() {
    return {
      accountType: '',
    };
  },
  computed: {
    ...mapState({
      id: (state) => { return parseInt(state.route.params.id, 10); },
    }),
  },
  methods: {
    validate(type) {
      if (type === 1) {
        this.$store.dispatch('setup/setAccountType', 'new');
        this.$router.push({ path: `/setup/${this.id + 1}` });
        return true;
      }
      this.$store.dispatch('setup/setAccountType', 'restored');
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
