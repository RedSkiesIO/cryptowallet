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
        let timeStamp = new Date(payment.ts * 1000);
        timeStamp = `${timeStamp.getDay} ${timeStamp.getYear}`;
        const groupItem = groupedPayments.find(item => item.date === timeStamp);

        if (!groupItem) {
          groupedPayments.push({
            date: timeStamp,
            payments: [],
          });
        }

        groupedPayments.map((item) => {
          if (item.date === timeStamp) item.payments.push(payment);
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
