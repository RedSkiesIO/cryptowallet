<template>
  <section class="recent-payments">
    <PaymentsGroup
      v-for="group in groupedPayments"
      :key="group.key"
      :group="group"
    />
  </section>
</template>

<script>
import PaymentsGroup from './PaymentsGroup.vue';

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default {
  name: 'RecentPayments',
  components: {
    PaymentsGroup,
  },
  computed: {
    payments() {
      return this.$store.state.wallet.payments;
    },
    /*
     * raw payments data is a flat array, it has to be transformed first,
     * payments have to be grouped by date, the function returns a groupedPayments Array
     * each group in the Array represents a day, eg. 12 November
     * each group will include payments that happened on that day
     * @return {Array}
     */
    groupedPayments() {
      const sortedByDate = this.payments.slice().sort((a, b) => b.ts - a.ts);
      const groupedPayments = [];
      let groupKey = 0;

      sortedByDate.forEach((payment) => {
        const day = new Date(payment.ts).getDate();
        const month = monthNames[new Date(payment.ts).getMonth()];
        const paymentDate = `${day} ${month}`;
        // eslint-disable-next-line
        const groupItem = groupedPayments.find((item) => {
          if (item) return item.date === paymentDate;
        });

        if (!groupItem) {
          groupedPayments.push({
            key: groupKey,
            date: paymentDate,
            payments: [],
          });

          groupKey += 1;
        }

        groupedPayments.map((item) => {
          if (item.date === paymentDate) item.payments.push(payment);
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
