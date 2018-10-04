<template>
  <div class="columns is-mobile no-margin-bottom">
    <div class="column is-2">
      <div class="circle"/>
    </div>
    <div class="column">
      <div class="columns is-mobile no-margin-bottom">
        <div class="column is-7 no-padding-bottom">{{ payment.title }}</div>
        <div class="column no-padding-bottom">
          <Amount
            :amount="payment.amount"
            variant="['grey']"
          />
        </div>
      </div>
      <div class="grey-text">
        {{ paymentTime }}
      </div>
    </div>
  </div>
</template>

<script>
import Amount from './Amount.vue';

export default {
  name: 'Payment',
  components: {
    Amount,
  },
  props: {
    payment: {
      type: Object,
      required: true,
    },
  },
  computed: {
    /*
     * converts timestamp into full date string and then extracts only the time out of it (HH:mm)
     * @return {String} eg. "02:59"
     */
    paymentTime() {
      return new Date(this.payment.ts).toTimeString().split(' ')[0].slice(0, 5);
    },
  },
};
</script>

<style scoped>
.no-padding-bottom {
  padding-bottom: 0;
}

.no-margin-bottom {
  margin-bottom: 0;
}

.circle {
  background: #ececec;
  border-radius: 100%;
  height: 2.5rem;
  width: 2.5rem;
  margin-top: 5px;
}
</style>
