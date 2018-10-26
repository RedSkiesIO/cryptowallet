<template>
  <div class="layout">
    <div class="list">
      <WalletsList
        :coins="coins"
        :currency="currency"
      />
    </div>
    <div class="button">
      <AddWallet/>
    </div>
  </div>
</template>

<script>
import WalletsList from '@/components/Wallet/Wallet/WalletsList.vue';
import AddWallet from '@/components/Wallet/Wallet/AddWallet.vue';

export default {
  name: 'Balance',
  components: {
    WalletsList,
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
      currency: 'GPB',
      coins: {
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
