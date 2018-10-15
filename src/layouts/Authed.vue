<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view/>
    </q-page-container>
    <transition
      enter-active-class="animated slideInUp"
      leave-active-class="animated slideOutDown"
    >
      <q-layout-footer v-show="isMainNavVisible">
        <MainNav/>
      </q-layout-footer>
    </transition>
  </q-layout>
</template>

<script>
import { mapState } from 'vuex';
import MainNav from '../components/Wallet/MainNav.vue';

export default {
  name: 'AuthedLayout',
  components: {
    MainNav,
  },
  data() {
    return {
      isMainNavVisible: false,
      transitionName: 'slide-left',
    };
  },
  computed: {
    ...mapState({
      isSearchingContacts: state => state.payments.isSearchingContacts,
    }),
  },
  watch: {
    $route(to, from) {
      this.updateMainNavVisiblity();
      const toDepth = to.path.split('/').length;
      const fromDepth = from.path.split('/').length;
      this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left';
    },
    isSearchingContacts() { this.updateMainNavVisiblity(); },
  },
  beforeMount() {
    this.updateMainNavVisiblity();
  },
  methods: {
    updateMainNavVisiblity() {
      if (this.$route.path === '/wallet/payments' && this.isSearchingContacts) {
        this.isMainNavVisible = false;
      } else {
        this.isMainNavVisible = true;
      }
    },
  },
};
</script>

<style>
.animated {
  animation-duration: 250ms;
}
</style>
