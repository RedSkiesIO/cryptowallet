<template>
  <div class="layout">
    <div class="list">
      <wallet-list
        :wallets="wallets"
        :currency="selectedCurrency"
      />
    </div>
    <div class="button">
      <add-wallet/>
    </div>
  </div>
</template>

<script>
import WalletList from '@/components/Wallet/WalletsList';
import AddWallet from '@/components/Wallet/AddWallet';

export default {
  name: 'Balance',

  components: {
    WalletList,
    AddWallet,
  },

  /**
   * @TODO James Konrad
   * data below is mocked
   *
   * currency String is a prefered user currency, should be in the Vuex store
   * you should probably select your prefered currency during the initial setup
   * alongside the language
   *
   * coins Object also shoudn't be here
   */
  data() {
    return {
      wallets: {
        BTC: {
          key: 'BTC',
          name: 'Bitcoin',
          balance: 25.532344,
          uid: 1,
        },
        ATL: {
          key: 'ATL',
          name: 'Atlas',
          balance: 21.532344,
          uid: 2,
        },
        ETH: {
          key: 'ETH',
          name: 'Ethereum',
          balance: 55.532344,
          uid: 3,
        },
      },
    };
  },

  computed: {
    selectedCurrency() {
      return this.$store.state.settings.selectedCurrency;
    },
  },
};

</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
}

.list {
  flex: 1;
  position: relative;
}
</style>
