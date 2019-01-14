<template>
  <div>
    <div class="wrapper">
      <div class="wallet-name">
        <img :src="coinLogo">
        {{ wallet.displayName }}
      </div>
      <div class="wallet-prices">
        <Amount
          :amount="wallet.confirmedBalance"
          :prepend-plus-or-minus="false"
          :currency="selectedCurrency"
          :to-currency="true"
          :coin="wallet.name"
          format="0.00"
        />
        <div>{{ balanceInCoin }} {{ coinSymbol }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Amount from '@/components/Wallet/Amount';
import { AmountFormatter } from '@/helpers';

export default {
  name: 'CoinHeader',
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
    ...mapState({
      authenticatedAccount: state => state.settings.authenticatedAccount,
    }),
    coinLogo() {
      const coin = this.supportedCoins.find(cc => cc.name === this.wallet.name);
      /* eslint-disable-next-line */
      return require(`@/assets/cc-icons/color/${coin.symbol.toLowerCase()}.svg`);
    },
    selectedCurrency() {
      return this.$store.state.settings.selectedCurrency;
    },
    supportedCoins() {
      return this.$store.state.settings.supportedCoins;
    },
    coinDenomination() {
      return this.supportedCoins.find(coin => coin.name === this.wallet.name).denomination;
    },
    coinSymbol() {
      return this.supportedCoins.find(coin => coin.name === this.wallet.name).symbol;
    },
    balanceInCoin() {
      const balanceInCoin = new AmountFormatter({
        amount: this.wallet.confirmedBalance,
        format: this.coinDenomination,
        prependPlusOrMinus: false,
        removeTrailingZeros: true,
      });

      return balanceInCoin.getFormatted();
    },
  },
};
</script>

<style scoped>
.wrapper {
  display: flex;
  justify-content: space-between;
}

.wallet-name {
  display: flex;
  align-items: center;
  font-size: 0.9em;
  font-family: 'Montserrat-Medium';
}

.wallet-name img {
  margin-right: 0.5em;
}

.wallet-prices {
  font-family: 'CooperHewitt-BoldItalic';
  font-size: 0.8em;
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
}

.wallet-prices > div {
  margin-left: auto;
}
</style>
