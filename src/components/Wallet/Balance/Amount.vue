<template>
  <div
    :class="{ 'grey-text': variant.indexOf('grey') >= 0 }"
    class="amount-box"
  >
    <div>{{ formattedAmount }}</div>
  </div>
</template>

<script>
import { amount } from '@/helpers';

export default {
  name: 'Amount',
  props: {
    amount: {
      type: Number,
      required: true,
    },
    variant: {
      type: String,
      default() {
        return '';
      },
    },
    currency: {
      type: String,
      default() {
        return '';
      },
    },
  },
  computed: {
    /**
     * Converts amount value (Number) into a String with optional currency symbol
     * @return {String}
     */
    formattedAmount() {
      return amount(this.amount, this.currency);
    },
  },
};
</script>

<style scoped>
  .amount-box {
    display: flex;
    justify-content: flex-end;
    text-align: right;
    white-space: nowrap;
  }
</style>
