<template>
  <div>
    <div class="header-section">
      <h1 class="header-h1">
        {{ $t('buy') }} {{ wallet.symbol }}
      </h1>
    </div>

    <div class="modal-layout-wrapper">
      Transak goes here
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'AddFunds',
  // data() {
  //   return {

  //   };
  // },
  computed: {
    ...mapState({
      id: (state) => { return parseInt(state.route.params.id, 10); },
      authenticatedAccount: (state) => { return state.settings.authenticatedAccount; },
    }),

    account() {
      return this.$store.getters['entities/account/find'](this.authenticatedAccount);
    },

    wallet() {
      return this.$store.getters['entities/wallet/find'](this.id);
    },
  },
};
</script>

<style>
.checkbox-wrapper {
  margin-top: 2rem;
  padding: 1rem;
  background: whitesmoke;
  border-radius: 0.3rem;
}

.checkbox-wrapper .q-checkbox__label {
  opacity: 1;
  font-family: Montserrat-Medium;
  margin-left: 0.8rem;
}

.checkbox-wrapper .q-checkbox-icon {
  font-size: 2rem;
}
</style>
