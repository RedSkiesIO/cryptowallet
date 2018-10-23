<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <Header/>
    </q-layout-header>

    <div
      :class="{ 'no-footer': !isMainNavVisible }"
      class="layout-wrapper"
    >
      <router-view/>
    </div>

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
import MainNav from '@/components/Wallet/MainNav.vue';
import Header from '@/components/Wallet/Header.vue';

export default {
  name: 'AuthedLayout',
  components: {
    MainNav,
    Header,
  },
  data() {
    return {
      isMainNavVisible: false,
      transitionName: 'slide-left',
    };
  },
  computed: {
    ...mapState({
      isSearchingContacts: state => state.search.isSearchingContacts,
    }),
  },
  watch: {
    /**
     * Watch the $route to keep the MainNav visibility updated
     */
    $route() {
      this.updateMainNavVisibility();
    },
    /**
     * Watch the isSearchingContacts to keep the MainNav visibility updated
     */
    isSearchingContacts() { this.updateMainNavVisibility(); },
  },
  /**
   * Make sure that the MainNav visibility is set correctly on initial render
   */
  beforeMount() {
    this.updateMainNavVisibility();
  },
  methods: {
    /**
     * Decide if the MainNav component should be visible
     * Update MainNav component visibility
     * @TODO James review future
     */
    updateMainNavVisibility() {
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
