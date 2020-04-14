<template>
  <div :class="{ simple: simple }">
    <div class="wrapper q-my-lg">
      <div>
        <div class="wallet-name">
          <img :src="coinLogo">
          {{ wallet.displayName }}
        </div>

        <div
          v-if="simple"
          class="q-pt-lg quick-coin-actions"
        >
          <q-btn-group>
            <q-btn
              :disabled="cantSend"
              icon="send"
              size="md"
              color="white"
              label="Send"
              class="wallet-group-btn"
              flat
              @click.stop="send"
            />
            <q-btn
              icon="call_received"
              size="md"
              color="white"
              label="Receive"
              class="wallet-group-btn"
              flat
              @click.stop="receive"
            />
          </q-btn-group>
        </div>
      </div>
      <div class="wallet-prices">
        <Amount
          v-if="latestPrice"
          :amount="unconfirmedBalance()"
          :rate="latestPrice"
          :prepend-plus-or-minus="false"
          :currency="selectedCurrency"
          :to-currency="true"
          :coin="wallet.name"
          format="0,0[.]00"
        />
        <div class="in-coin">
          {{ balanceInCoin }} {{ coinSymbol }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Amount from '@/components/Wallet/Amount';
import Coin from '@/store/wallet/entities/coin';
import IconList from '@/statics/cc-icons/icons-list.json';
import {
  AmountFormatter,
  getBalance,
} from '@/helpers';

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
    simple: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    ...mapState({
      authenticatedAccount: (state) => {
        return state.settings.authenticatedAccount;
      },
    }),

    coinLogo() {
      if (IconList.find((icon) => { return icon.symbol === this.wallet.symbol.toUpperCase(); })) {
        return `./statics/cc-icons/color/${this.wallet.symbol.toLowerCase()}.svg`;
      }
      return './statics/cc-icons/color/generic.svg';
    },

    selectedCurrency() {
      return this.$store.state.settings.selectedCurrency;
    },

    supportedCoins() {
      return Coin.all();
    },

    coinSymbol() {
      return this.supportedCoins.find((coin) => {
        return coin.name === this.wallet.name;
      }).symbol;
    },

    latestPrice() {
      const prices = this.$store.getters['entities/latestPrice/find'](`${this.coinSymbol}_${this.selectedCurrency.code}`);
      if (prices) {
        return prices.data.PRICE;
      }
      return null;
    },

    balanceInCoin() {
      const balance = this.unconfirmedBalance();

      const balanceInCoin = new AmountFormatter({
        amount: balance,
        rate: this.latestPrice,
        format: '0.00000000',
        prependPlusOrMinus: false,
        removeTrailingZeros: true,
      });

      return balanceInCoin.getFormatted();
    },

    cantSend() {
      return getBalance(this.wallet, this.authenticatedAccount).available === 0;
    },
  },

  methods: {
    send() {
      this.$router.push({ path: `/wallet/single/send/${this.wallet.id}` });
    },
    receive() {
      this.$router.push({ path: `/wallet/single/receive/${this.wallet.id}` });
    },
    unconfirmedBalance() {
      return getBalance(this.wallet, this.authenticatedAccount).unconfirmed;
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

.simple .wallet-name {
  display: none;
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

.simple .wrapper {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-flow: column-reverse;
}

.simple .wallet-prices {
  font-size: 1.8rem;
  text-align: center;
  justify-content: center;
  align-items: center;
}

.wallet-prices > div {
  margin-left: auto;
}

.simple .wallet-prices > div {
  margin: 0 auto;
}

.simple .in-coin {
  font-size: 2rem;
  opacity: 0.8;
}

.quick-coin-actions {
  margin-top: 0.2rem 0;
}
</style>
