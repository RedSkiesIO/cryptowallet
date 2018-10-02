<!--

it renders a div with amount-ox class
it variant grey is passed, it renders grey-text class
it rendersp properly formatted amount

 -->


<template>
  <div
    :class="{ 'grey-text': variant.indexOf('grey') != -1 }"
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
