<template>
  <section>
    <PaymentsGroupHeader :group="group" />
    <Payment
      v-for="payment in group.payments"
      :key="payment.ts"
      :payment="payment"
    />
  </section>
</template>

<script>
import PaymentsGroupHeader from './PaymentsGroupHeader.vue';
import Payment from './Payment.vue';

export default {
  name: 'PaymentsGroup',
  components: {
    PaymentsGroupHeader,
    Payment,
  },
  props: {
    group: {
      type: Object,
      required: true,
    },
  },
};
</script>
