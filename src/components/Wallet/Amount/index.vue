<template>
  <div class="amount-box">
    {{ formattedAmount }}
  </div>
</template>
<script>
import AmountFormatter from '@/helpers/AmountFormatter';

export default {
  name: 'Amount',
  props: {
    amount: {
      type: Number,
      required: true,
    },
    rate: {
      type: String,
      required: false,
    },
    prependPlusOrMinus: {
      type: Boolean,
      required: false,
    },
    currency: {
      type: Object,
      required: false,
    },
    toCurrency: {
      type: Boolean,
      required: false,
    },
    toCoin: {
      type: Boolean,
      required: false,
    },
    coin: {
      type: String,
      required: false,
    },
    format: {
      type: String,
      required: false,
    },
  },
  computed: {
    /**
     * Converts amount value (Number) into a String
     * @return {String}
     */
    formattedAmount() {
      const {
        amount,
        rate,
        format,
        coin,
        prependPlusOrMinus,
        currency,
        toCurrency,
        toCoin,
      } = this;

      const formattedAmount = new AmountFormatter({
        amount,
        rate,
        format,
        coin,
        prependPlusOrMinus,
        currency,
        toCurrency,
        toCoin,
        withCurrencySymbol: true,
      });

      return formattedAmount.getFormatted();
    },
  },
};
</script>

<style scoped>
  .amount-box {
    display: flex;
    white-space: nowrap;
  }
</style>
