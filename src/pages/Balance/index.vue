<template>
  <div>
    <q-pull-to-refresh :handler="refresher">
      <UserBalance/>
      <Transactions/>
    </q-pull-to-refresh>
  </div>
</template>

<script>
import UserBalance from '@/components/Wallet/Balance';
import Transactions from '@/components/Wallet/Transactions';

export default {
  name: 'Balance',

  components: {
    UserBalance,
    Transactions,
  },

  methods: {
    refresher(done) {
      setTimeout(() => {
        done();
      }, 1000);
    },
  },
};

</script>

<style scoped>

</style>
