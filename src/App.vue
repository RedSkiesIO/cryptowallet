<template>
  <div id="q-app">
    <router-view/>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'App',

  computed: {
    ...mapState({
      settings: state => state.settings,
    }),
  },

  beforeCreate() {

  },

  created() {
    /*  if (this.account.salt === null) {
      this.$router.push({ path: 'setup/seed' });
      return false;
    }

    if (this.account.pin === null) {
      this.$router.push({ path: 'setup/Pin' });
      return false;
    }

    return true;  */
  },

  beforeMount() {

  },

  mounted() {
    this.$toast.create(5, 'some warning', 500);
    // this.$toast.create();
    // console.log(this.$toast.create());
    // if (this !== 1) {
    //   console.trace();
    //   throw new Error(20);
    // }
    const accounts = this.$store.getters['entities/account/query']().get();
    // console.log(accounts);

    // check with have at least one account in the data base,
    // otherwise send them to setup.
    if (accounts.length < 1) {
      return false;
    }

    return true;
  },

  beforeUpdate() {

  },

  updated() {

  },

  beforeDestroy() {

  },

  destroyed() {

  },
};
</script>

<style lang='scss'>
@import 'bulma/sass/utilities/_all.sass';
@import 'bulma/sass/base/_all.sass';

body {
  background-color: #1e3c57;
  color: white;
}
</style>
