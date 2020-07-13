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
          where: (record) => { return record.id === this.authenticatedAccount; },
          data: {
            showTestnets: val,
          },
        });
      },
    },
  },

  methods: {
    async toggleTestnets(val) {
      await Coin.$update({
        where: (record) => { return record.testnet === true; },
        data: {
          show: val,
        },
      });
    },
  },
};
</script>

<style>

</style>
