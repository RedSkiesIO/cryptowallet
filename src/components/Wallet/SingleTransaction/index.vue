<template>
  <q-timeline-entry
    :title="date"
    side="left"
  >
    <q-expansion-item
      :label="amount"
      :class="{ 'positive-amount': !data.sent, 'negative-amount': data.sent }"
    >
      <q-card>
        <q-card-section>
          <div class="single-transaction-content">
            <p>
              TX Hash:
              <span class="tx-hash break">{{ data.hash }}</span>
            </p>
            <p>
              {{ $t('status') }}:
              <span
                :class="{
                  'unconfirmed-tx': data.confirmations < minConfirmations,
                  'confirmed-tx': data.confirmations >= minConfirmations,
                }"
                class="status"
              >
                {{ status }}
              </span>
            </p>
            <p>
              {{ $t('confirmations') }}:
              <span class="confirmations">{{ data.confirmations }}</span>
            </p>
            <p>
              TX {{ $t('fee') }}:
              <span class="tx-fee">{{ feeFormated }}</span>
            </p>
            <p>
              {{ $t('blockHeight') }}:
              <span class="tx-height">{{ data.blockHeight }}</span>
            </p>
          </div>
        </q-card-section>
      </q-card>
    </q-expansion-item>

  </q-timeline-entry>
</template>

<script>
import { mapState } from 'vuex';
import { dateTranslater, AmountFormatter } from '@/helpers';
import Coin from '@/store/wallet/entities/coin';

export default {
  name: 'SingleTransaction',

  props: {
    data: {
      type: Object,
      required: true,
    },
  },

  computed: {
    ...mapState({
      id: (state) => { return state.route.params.id; },
    }),
    wallet() {
      return this.$store.getters['entities/wallet/find'](this.id);
    },
    selectedCurrency() {
      return this.$store.state.settings.selectedCurrency;
    },
    supportedCoins() {
      return Coin.all();
    },
    coinDenomination() {
      return this.supportedCoins.find((coin) => {
        return coin.name === this.wallet.name;
      }).denomination;
    },
    minConfirmations() {
      return this.supportedCoins.find((coin) => {
        return coin.name === this.wallet.name;
      }).minConfirmations;
    },
    coinSymbol() {
      return this.supportedCoins.find((coin) => { return coin.name === this.wallet.name; }).symbol;
    },
    latestPrice() {
      const prices = this.$store.getters['entities/latestPrice/find'](`${this.coinSymbol}_${this.selectedCurrency.code}`);
      if (prices) {
        return prices.data.PRICE;
      }
      return null;
    },

    /**
     * Prepends "To: " or "From: " into transaction title
     * @return {String}
     */
    paymentDirection() {
      if (this.data.sent) {
        let { receiver } = this.data;
        if (Array.isArray(receiver)) { [receiver] = receiver; }
        return `${this.$t('to')}: ${receiver}`;
      }

      let { sender } = this.data;
      if (Array.isArray(sender)) { [sender] = sender; }
      return `${this.$t('from')}: ${sender}`;
    },

    to() {
      let { receiver } = this.data;
      if (Array.isArray(receiver)) { [receiver] = receiver; }
      return receiver;
    },

    /**
     * Returns formatted date of the transaction
     * @return {String}
     */
    date() {
      const msToS = 1000;
      if (this.data.receivedTime) {
        return dateTranslater(new Date(this.data.receivedTime * msToS).valueOf(), 'DD MMMM HH:mm YYYY', this);
      }
      return dateTranslater(new Date(this.data.confirmedTime * msToS).valueOf(), 'DD MMMM HH:mm YYYY', this);
    },

    /**
     * Converts amount value (Number) into a String
     * @return {String}
     */
    amount() {
      const { value } = this.data;
      let inCoin = value;
      if (this.data.sent) { inCoin = -Math.abs(inCoin); }

      const amountInCoin = new AmountFormatter({
        amount: inCoin,
        rate: this.latestPrice,
        format: this.coinDenomination,
        prependPlusOrMinus: true,
        removeTrailingZeros: true,
      });

      if (this.latestPrice) {
        const amountInCurrency = new AmountFormatter({
          amount: inCoin,
          rate: this.latestPrice,
          format: '0,0[.]00',
          coin: this.wallet.name,
          prependPlusOrMinus: false,
          currency: this.selectedCurrency,
          toCurrency: true,
          toCoin: false,
          withCurrencySymbol: true,
        });

        return `${amountInCoin.getFormatted()} ${this.coinSymbol} (${amountInCurrency.getFormatted()})`;
      }
      return `${amountInCoin.getFormatted()} ${this.coinSymbol}`;
    },

    /**
     * Displays the fee
     * @return {String}
     */
    feeFormated() {
      const { fee } = this.data;
      const inCoin = fee;
      if (this.latestPrice) {
        let feeInCoin = new AmountFormatter({
          amount: inCoin,
          rate: this.latestPrice,
          format: this.coinDenomination,
          prependPlusOrMinus: false,
          removeTrailingZeros: true,
        });

        let amountInCurrency = new AmountFormatter({
          amount: feeInCoin.getFormatted(),
          rate: this.latestPrice,
          format: '0,0[.]00',
          coin: this.wallet.name,
          prependPlusOrMinus: false,
          currency: this.selectedCurrency,
          toCurrency: true,
          toCoin: false,
          withCurrencySymbol: true,
        });

        if (this.wallet.sdk === 'ERC20') {
          const parent = this.supportedCoins.find((coin) => {
            return coin.name === this.wallet.parentName;
          });
          const price = this.$store.getters['entities/latestPrice/find'](`${parent.symbol}_${this.selectedCurrency.code}`).data.PRICE;

          feeInCoin = new AmountFormatter({
            amount: inCoin,
            rate: price,
            format: parent.denomination,
            prependPlusOrMinus: false,
            removeTrailingZeros: true,
          });

          amountInCurrency = new AmountFormatter({
            amount: feeInCoin.getFormatted(),
            rate: price,
            format: '0,0[.]00',
            coin: this.wallet.parentName,
            prependPlusOrMinus: false,
            currency: this.selectedCurrency,
            toCurrency: true,
            toCoin: false,
            withCurrencySymbol: true,
          });
          return `${fee} ${parent.symbol} (${amountInCurrency.getFormatted()})`;
        }

        return `${fee} ${this.coinSymbol} (${amountInCurrency.getFormatted()})`;
      }

      return `${fee} ${this.coinSymbol}`;
    },

    /**
     * Returns the transaction status in a human friendly format
     * @return {String}
     */
    status() {
      if (this.data.confirmations > this.minConfirmations) { return this.$t('confirmed'); }
      if (this.data.confirmations > 0) { return this.$t('unconfirmed'); }
      return this.$t('pending');
    },
  },
};
</script>

<style>
.positive-amount .q-item__label,
.status.confirmed-tx {
  color: green;
}

.negative-amount .q-item__label,
.status.unconfirmed-tx {
  color: red;
}

.q-timeline-entry {
  padding-left: 1.5rem;
}

.q-item {
  padding: 0;
}

.q-timeline-content {
  padding-bottom: 0.5rem;
}

.q-timeline-title {
  margin-bottom: 0rem;
}

.q-timeline-dot:after {
  opacity: 0.1;
  left: 7px;
}

.q-timeline-dot:before, .q-timeline-dot:after {
    content: '';
    background: #4e677d;
    display: block;
    position: absolute;
}

.q-timeline-dot:before {
    border: 3px solid transparent;
    border-radius: 100%;
    height: 12px;
    width: 12px;
    top: 5px;
    left: 2px;
    transition: background 0.3s ease-in-out, border 0.3s ease-in-out;
}

.q-timeline {
  padding: 0.5rem;
}

.single-transaction-content {
  font-size: 0.8rem;
}

.q-timeline--dense--right
.q-timeline__entry {
  padding-left: 1.5rem;
}

.q-timeline__title {
  font-size: 1rem;
  padding-top: 0.1rem;
  margin-bottom: 0;
}

.q-expansion-item .q-item__label {
  font-size: 0.8rem;
}

.q-expansion-item .q-item {
  min-height: 1rem;
}

.q-expansion-item .q-card__section {
  padding: 0;
}

.q-expansion-item .q-card__section p {
  margin: 0;
  padding: 0.5rem;
  border-top: 1px solid whitesmoke;
}

.q-expansion-item__container {
  border-top: 1px solid white;
}

.break {
  word-break: break-all;
}
</style>
