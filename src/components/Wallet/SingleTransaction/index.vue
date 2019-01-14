<template>
  <q-timeline-entry
    :title="paymentDirection"
    side="left"
  >
    <q-collapsible
      :label="date"
      :sublabel="amount"
      :class="{ 'positive-amount': !data.sent, 'negative-amount': data.sent }"
    >
      <div>
        <p>
          {{ $t('received') }}:<br>
          <span class="received">{{ to }}</span>
        </p>
        <p>
          TX Hash:<br>
          <span class="tx-hash">{{ data.hash }}</span>
        </p>
        <p>
          {{ $t('status') }}:<br>
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
          {{ $t('confirmations') }}:<br>
          <span class="confirmations">{{ data.confirmations }}</span>
        </p>
        <p>
          TX {{ $t('fee') }}:<br>
          <span class="tx-fee">{{ feeFormated }}</span>
        </p>
        <p>
          {{ $t('blockHeight') }}:<br>
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
        format: this.coinDenomination,
        prependPlusOrMinus: true,
        removeTrailingZeros: true,
      });

      const amountInCurrency = new AmountFormatter({
        amount: inCoin,
        format: '0.00',
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

      const feeInCoin = new AmountFormatter({
        amount: inCoin,
        format: this.coinDenomination,
        prependPlusOrMinus: false,
        removeTrailingZeros: true,
      });

      const amountInCurrency = new AmountFormatter({
        amount: feeInCoin.getFormatted(),
        format: '0.00',
        coin: this.wallet.name,
        prependPlusOrMinus: false,
        currency: this.selectedCurrency,
        toCurrency: true,
        toCoin: false,
        withCurrencySymbol: true,
      });

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

<style lang="scss">
  .positive-amount .q-item-sublabel, .confirmed-tx  {
    color: green;
  }

  .negative-amount .q-item-sublabel, .unconfirmed-tx {
    color: red;
  }
</style>
