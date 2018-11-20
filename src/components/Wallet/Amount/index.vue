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
    prependPlusOrMinus: {
      type: Boolean,
      required: false,
    },
    currency: {
      type: Object,
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
        format,
        coin,
        prependPlusOrMinus,
        currency,
      } = this;

      const formattedAmount = new AmountFormatter({
        amount,
        format,
        coin,
        prependPlusOrMinus,
        currency,
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
