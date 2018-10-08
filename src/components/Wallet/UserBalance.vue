<template>
  <section class="user-balance">
    <h1 class="balance-h1">£{{ UserBalance }}</h1>
    <div>Balance</div>
  </section>
</template>

<script>
export default {
  name: 'UserBalance',
  computed: {
    UserBalance() {
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
  font-size: 50px;
  font-weight: bold;
}
</style>
