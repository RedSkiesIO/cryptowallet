<template>
  <div
    class="settings-row"
  >
    <div>
      {{ $t('toggleTestnets') }}
    </div>
    <div>
      <q-toggle
        v-model="allowTestnets"
        color="primary"
        @input="toggleTestnets"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Account from '@/store/wallet/entities/account';
import Coin from '@/store/wallet/entities/coin';

export default {
  name: 'ToggleTestnets',
  // data() {
  //   return {
  //     allowTestnets: true,
  //   };
  // },

  computed: {
    ...mapState({
      authenticatedAccount: (state) => { return state.settings.authenticatedAccount; },
    }),
    allowTestnets: {
      get() {
        return this.$store.getters['entities/account/find'](this.authenticatedAccount).showTestnets;
      },
      set(val) {
        Account.$update({
          where: this.authenticatedAccount,
          data: {
            showTestnets: val,
          },
        });
      },
    },
    testnets() {
      return Coin.query().where('testnet', true).get();
    },
  },

  methods: {
    async toggleTestnets(val) {
      this.testnets.forEach((coin) => {
        Coin.$update({
          where: coin.id,
          data: {
            show: val,
          },
        });
      });
    },
  },
};
</script>

<style>

</style>
