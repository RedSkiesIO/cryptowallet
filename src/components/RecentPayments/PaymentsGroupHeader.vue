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
    balanceChange() {
      return this.group.payments.reduce((accumulator, payment) => accumulator + payment.amount, 0);
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
