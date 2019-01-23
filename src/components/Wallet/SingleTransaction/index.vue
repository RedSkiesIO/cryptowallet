<template>
  <q-timeline-entry
    :title="date"
    side="left"
  >
    <q-collapsible
      :sublabel="amount"
      :class="{ 'positive-amount': !data.sent, 'negative-amount': data.sent }"
    >
      <div>
        <!-- <p>
          {{ $t('received') }}:
          <span class="received">{{ to }}</span>
        </p> -->
        <p>
          TX Hash:
          <span class="tx-hash">{{ data.hash }}</span>
        </p>
        <p>
          {{ $t('status') }}:
          <span
            :class="{
              'unconfirmed-tx': data.confirmations < 6,
              'confirmed-tx': data.confirmations >= 6,
            }"
            class="status"
          >
            {{ $t(status) }}
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
    </q-collapsible>
  </q-timeline-entry>
</template>

<script>
import { mapState } from 'vuex';
import { dateTranslater, AmountFormatter } from '@/helpers';

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
      id: state => state.route.params.id,
    }),

    wallet() {
      return this.$store.getters['entities/wallet/find'](this.id);
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
    latestPrice() {
      const prices = this.$store.getters['entities/latestPrice/find'](`${this.coinSymbol}_${this.selectedCurrency.code}`);
      return prices.data.PRICE;
    },

    /**
     * Prepends "To: " or "From: " into transaction title
     * @return {String}
     */
    paymentDirection() {
      if (this.data.sent) {
        let { receiver } = this.data;
        if (Array.isArray(receiver)) [receiver] = receiver;
        return `${this.$t('to')}: ${receiver}`;
      }

      let { sender } = this.data;
      if (Array.isArray(sender)) [sender] = sender;
      return `${this.$t('from')}: ${sender}`;
    },

    to() {
      let { receiver } = this.data;
      if (Array.isArray(receiver)) [receiver] = receiver;
      return receiver;
    },

    /**
     * Returns formatted date of the transaction
     * @return {String}
     */
    date() {
      if (this.data.receivedTime) {
        return dateTranslater(new Date(this.data.receivedTime * 1000).valueOf(), 'DD MMMM HH:mm YYYY', this);
      }
      return dateTranslater(new Date(this.data.confirmedTime * 1000).valueOf(), 'DD MMMM HH:mm YYYY', this);
    },

    /**
     * Converts amount value (Number) into a String
     * @return {String}
     */
    amount() {
      const { value } = this.data;
      let inCoin = value;
      if (this.data.sent) inCoin = -Math.abs(inCoin);

      const amountInCoin = new AmountFormatter({
        amount: inCoin,
        rate: this.latestPrice,
        format: this.coinDenomination,
        prependPlusOrMinus: true,
        removeTrailingZeros: true,
      });

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
    },

    /**
     * Displays the fee
     * @return {String}
     */
    feeFormated() {
      const { fee } = this.data;
      const inCoin = fee;

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
        const parent = this.supportedCoins.find(coin => coin.name === this.wallet.parentName);

        feeInCoin = new AmountFormatter({
          amount: inCoin,
          rate: this.latestPrice,
          format: parent.denomination,
          prependPlusOrMinus: false,
          removeTrailingZeros: true,
        });

        amountInCurrency = new AmountFormatter({
          amount: feeInCoin.getFormatted(),
          rate: this.latestPrice,
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
    },

    /**
     * Returns the transaction status in a human friendly format
     * @return {String}
     */
    status() {
      if (this.data.confirmations > 5) return 'confirmed';
      if (this.data.confirmations > 0) return 'unconfirmed';
      return 'pending';
    },
  },
};
</script>

<style>
  .positive-amount .q-item-sublabel, .confirmed-tx  {
    color: green;
  }

  .negative-amount .q-item-sublabel, .unconfirmed-tx {
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

  .q-collapsible-sub-item {
    padding: 0;
    word-break: break-all;
  }

  .q-collapsible-sub-item p {
    margin: 0;
    padding: 0.5rem;
    border-top: 1px solid whitesmoke;
  }


</style>
