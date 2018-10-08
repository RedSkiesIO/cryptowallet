<template>
  <q-layout>
    <UserBalance/>
    <RecentPayments/>
    <q-layout-footer>
      <MainNav/>
    </q-layout-footer>
  </q-layout>
</template>

<script>
import Balance from '../../components/Wallet/Balance.vue';
import RecentPayments from '../../components/Wallet/RecentPayments.vue';
import MainNav from '../components/MainNav/Wallet/MainNav.vue';

export default {
  name: 'Balance',
  components: {
    Balance,
    RecentPayments,
    MainNav,
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
