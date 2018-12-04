<template>
  <div class="layout">
    <div class="list">
      <WalletsList
        :wallets="wallets"
        :currency="selectedCurrency"
        click-item-action="selectWallet"
      />
    </div>
    <div class="button">
      <AddWallet/>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import WalletsList from '@/components/Wallet/WalletsList';
import AddWallet from '@/components/Wallet/AddWallet';
import Wallet from '@/store/wallet/entities/wallet';

export default {
  name: 'Wallet',
  components: {
    WalletsList,
    AddWallet,
  },
  computed: {
    ...mapState({
      authenticatedAccount: state => state.settings.authenticatedAccount,
    }),
    selectedCurrency() {
      return this.$store.state.settings.selectedCurrency;
    },
    wallets() {
      return Wallet.query().where('account_id', this.authenticatedAccount).get();
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
