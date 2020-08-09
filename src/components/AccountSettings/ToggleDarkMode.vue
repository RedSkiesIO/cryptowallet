<template>
  <div
    class="settings-row"
  >
    <div>
      {{ $t('toggleDarkMode') }}
    </div>
    <div>
      <q-toggle
        v-model="darkMode"
        color="primary"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Account from '@/store/wallet/entities/account';

export default {
  name: 'ToggleDarkMode',

  computed: {
    ...mapState({
      authenticatedAccount: (state) => { return state.settings.authenticatedAccount; },
    }),

    darkMode: {
      get() {
        return Account.find(this.authenticatedAccount).darkMode;
      },
      set(val) {
        Account.$update({
          where: (record) => { return record.id === this.authenticatedAccount; },
          data: {
            darkMode: val,
          },
        });
      },
    },
  },

  methods: {

  },
};
</script>

<style>

</style>
