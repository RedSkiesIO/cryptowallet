<template>
  <div id="q-app">
    <transition
      name="fade"
      mode="out-in"
    >
      <router-view/>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'App',

  computed: {
    ...mapState({
      account: state => state.account,
    }),
  },

  beforeCreate() {

  },

  created() {
    if (this.account.salt === null) {
      this.$router.push({ path: 'setup/seed' });
      return false;
    }

    if (this.account.pin === null) {
      this.$router.push({ path: 'setup/Pin' });
      return false;
    }

    return true;
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
};
</script>

<style lang='scss'>

@import 'bulma/sass/utilities/_all.sass';
@import 'bulma/sass/base/_all.sass';
@import 'bulma/sass/layout/_all.sass';
@import 'bulma/sass/elements/button.sass';
@import 'bulma/sass/elements/form.sass';
@import 'bulma/sass/elements/icon.sass';
@import 'bulma/sass/elements/container.sass';
@import 'bulma/sass/elements/content.sass';
@import 'bulma/sass/elements/notification.sass';
@import 'bulma/sass/elements/title.sass';
@import 'bulma/sass/components/card.sass';
@import 'bulma/sass/components/media.sass';
@import 'bulma/sass/grid/columns.sass';

body {
  background-color: #1e3c57;
  color: white;
}
</style>
