<template>
  <div class="columns is-mobile payments-group-header">
    <div class="column">
      {{ group.date }}
    </div>
    <div class="column">
      <Amount :amount="balanceChange"/>
    </div>
  </div>
</template>

<script>
import Amount from './Amount.vue';

export default {
  name: 'PaymentsGroupHeader',
  components: {
    Amount,
  },
  props: {
    group: {
      type: Object,
      required: true,
    },
  },
  computed: {
    /*
     * adds up all of the paymements amounts within this payment group
     * will result in eiter a positive or a negative number
     * @return {Number}
     */
    balanceChange() {
      return this.group.payments.reduce((accumulator, payment) => { return accumulator + payment.amount; }, 0);
    },
  },
};
</script>

<style scoped>
.payments-group-header {
  margin-bottom: -1rem;
  margin-top: 0.5rem;
}
</style>
