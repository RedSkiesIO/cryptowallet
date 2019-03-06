<template>
  <section class="user-balance">
    <div class="coin">
      {{ wallet.displayName }}
    </div>
    <div>
      <h1 class="balance-h1">
        <Amount
          :amount="userBalance"
          :currency="selectedCurrency"
          :prepend-plus-or-minus="false"
          :coin="wallet.name"
          :to-currency="true"
          format="0.00"
        />
      </h1>
      <div>{{ $t('balance') }}</div>
    </div>
  </section>
</template>

<script>
import Amount from '@/components/Wallet/Amount';
import Tx from '@/store/wallet/entities/tx';

export default {
  name: 'UserBalance',

  components: {
    Amount,
  },

  props: {
    wallet: {
      type: Object,
      required: true,
    },
  },

  computed: {
    selectedCurrency() {
      return this.$store.state.settings.selectedCurrency;
    },

    /**
     * Returns user balance from Vuex state
     * @returns {Number}
     */
    userBalance() {
      const pendingTxs = Tx.query().where('wallet_id', this.wallet.id).where('confirmations', 0).get();

      let pendingBalance = 0;
      pendingTxs.forEach((tx) => {
        if (tx.sent) {
          pendingBalance -= parseFloat(tx.value) + parseFloat(tx.fee);
        }
      });

      return this.wallet.confirmedBalance + pendingBalance;
    },
  },
};
</script>

<style scoped>
.coin {
  font-size: 1.5rem;
}

.user-balance {
  text-align: center;
  height: 15vh;
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: space-around;
  align-items: center;
}

.balance-h1 {
  font-size: 2rem;
  font-family: 'CooperHewitt-SemiboldItalic';
  letter-spacing: 0.1px;
  margin-top: 0.5rem;
  margin-bottom: -0.5rem;
  display: flex;
  justify-content: center;
}
</style>
