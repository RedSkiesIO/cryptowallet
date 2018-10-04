<template>
  <div
    :class="{ 'grey-text': variant.indexOf('grey') >= 0 }"
    class="amount-box"
  >
    <div>{{ formattedAmount }}</div>
  </div>
</template>

<script>
import numeral from 'numeral';

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
  },
  computed: {
    /*
     * converts raw amount {Number} into a {String} that begins with
     * either "+" or "-" and ends with " £"" also, it formats the number
     * into currency friendly format: "0.00"
     * @return {String} eg. "+12.40 £" or "-1.00 £"
     */
    formattedAmount() {
      const formatted = `${numeral(this.amount).format('0.00')} £`;
      return (this.amount > 0 ? `+${formatted}` : formatted);
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
