<template>
  <div
    class="amount-box"
  >
    <div v-html="formattedAmount"/>
  </div>
</template>

<script>
import { Amount } from '@/helpers';

export default {
  name: 'Amount',
  props: {
    amount: {
      type: Number,
      required: true,
    },
    prependPlusOrMinus: {
      type: Boolean,
      default() {
        return true;
      },
    },
    currency: {
      type: String,
      default() {
        return null;
      },
    },
    coin: {
      type: String,
      default() {
        return null;
      },
    },
    format: {
      type: String,
      default() {
        return null;
      },
    },
  },
  computed: {
    /**
     * Converts amount value (Number) into a String
     * @return {String}
     */
    formattedAmount() {
      const amount = new Amount(this.amount);
      if (this.currency) amount.currency = this.currency;
      if (this.format) amount.format = this.format;
      if (this.coin) amount.coin = this.coin;
      if (this.prependPlusOrMinus) amount.prependPlusOrMinus = this.prependPlusOrMinus;
      return amount.formatted;
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
