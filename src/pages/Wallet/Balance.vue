<template>
  <q-layout>
    <UserBalance />
    <RecentPayments />
  </q-layout>
</template>

<script>
import UserBalance from '../../components/Wallet/Balance/Balance.vue';
import RecentPayments from '../../components/Wallet/Balance/RecentPayments.vue';

export default {
  name: 'Balance',

  components: {
    UserBalance,
    RecentPayments,
  },

  data() {
    return {

    };
  },

  beforeCreate() {

  },

  created() {

  },

  beforeMount() {

  },

  mounted() {

  },

  beforeUpdate() {

  },

  updated() {

  },

  beforeDestroy() {

  },

  destroyed() {

  },

  methods: {

  },

};

</script>

<style scoped>

</style>
