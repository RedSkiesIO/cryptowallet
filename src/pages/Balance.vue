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
import UserBalance from '../components/UserBalance/UserBalance.vue';
import RecentPayments from '../components/RecentPayments/RecentPayments.vue';
import MainNav from '../components/MainNav/MainNav.vue';

export default {
  name: 'Balance',
  components: {
    UserBalance,
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
