<template>
  <section class="recent-payments">
    <PaymentsGroup
      v-for="group in groupedPayments"
      :key="group"
      :group="group"
    />
  </section>
</template>

<script>
import { date } from 'quasar';
import PaymentsGroup from './PaymentsGroup.vue';

export default {
  name: 'RecentPayments',
  components: {
    PaymentsGroup,
  },

  computed: {
    payments() {
      return this.$store.state.wallet.payments;
    },
    groupedPayments() {
      const sortedByDate = this.payments.slice().sort((a, b) => b.ts - a.ts);
      const groupedPayments = [];

      sortedByDate.forEach((payment) => {
        const groupItem = groupedPayments.find(item => item.date === date.formatDate(payment.ts, 'DD MMMM'));

        if (!groupItem) {
          groupedPayments.push({
            date: date.formatDate(payment.ts, 'DD MMMM'),
            payments: [],
          });
        }

        groupedPayments.map((item) => {
          if (item.date === date.formatDate(payment.ts, 'DD MMMM')) item.payments.push(payment);
          return item;
        });
      });

      return groupedPayments;
    },
  },
};
</script>

<style scoped>
  .recent-payments {
    padding: 0rem 1rem 1rem 1rem;
    border-top: 1px solid grey;
    border-bottom: 1px solid grey;
    position: relative;
    overflow-y: scroll;
    margin: 0 10px;
  }
</style>
