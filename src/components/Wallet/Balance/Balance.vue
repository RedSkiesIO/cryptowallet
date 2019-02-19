<template>
  <section class="user-balance">
    <h1 class="balance-h1">
      £{{ UserBalance }}
    </h1>
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
  font-size: 3.5rem;
  font-family: 'CooperHewitt-SemiboldItalic';
  letter-spacing: 0.1px;
  margin-top: 0.5rem;
  margin-bottom: -0.5rem;
}
</style>
