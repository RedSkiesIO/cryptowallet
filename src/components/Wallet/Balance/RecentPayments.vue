<template>
  <section class="recent-payments">
    <q-scroll-area class="recent-payments-scroll-area">
      <div class="scroll-content">
        <PaymentsGroup
          v-for="group in groupedPayments"
          :key="group.key"
          :group="group"
        />
      </div>
    </q-scroll-area>
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
      return this.$store.state.payments.payments;
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
        const groupItem = groupedPayments.find(item => item.date === paymentDate);

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
  .recent-payments-scroll-area {
    width: auto;
    height: 100%;
  }

  .recent-payments {
    height: 60vh;
    border-top: 2px solid #09233a;
    position: relative;
    background: #16324a;
  }

  .scroll-content {
    overflow: hidden;
    padding: 0 1rem;
  }
</style>
