<template>
  <section class="user-balance">
    <h1 class="balance-h1">
      <Amount
        :amount="userBalance"
        :prepend-plus-or-minus="false"
        :currency="'GPB'"
        :format="'0.00'"
      />
    </h1>
    <div>Balance</div>
  </section>
</template>

<script>
import Amount from '@/components/Wallet/SharedComponents/Amount.vue';

export default {
  name: 'UserBalance',
  components: {
    Amount,
  },
  computed: {

    /**
     * Returns user balance from Vuex state
     * @returns {Number}
     *
     * @TODO James Konrad
     * the userBalance should be pulled from a selected wallet
     * not from state.payments.balance
     */
    userBalance() {
      return this.$store.state.payments.balance;
    },
  },
};
</script>

<style scoped>
.user-balance {
  text-align: center;
  height: 25vh;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center
}

.balance-h1 {
  font-size: 3.5rem;
  font-family: 'CooperHewitt-SemiboldItalic';
  letter-spacing: 0.1px;
  margin-top: 0.5rem;
  margin-bottom: -0.5rem;
  display: flex;
  justify-content: center;
}
</style>
