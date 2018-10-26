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
      const {
        amount,
        format,
        coin,
        prependPlusOrMinus,
        currency,
      } = this;

      const formattedAmount = new Amount({
        amount,
        format,
        coin,
        prependPlusOrMinus,
        currency,
      });

      return formattedAmount.formatted;
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
