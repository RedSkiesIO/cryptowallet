import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

export default new VueRouter({
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      component: () => import('layouts/UnAuthed.vue'),
      children: [
        { path: '', component: () => import('pages/Login.vue') },
      ],
    },
    {
      path: '/setup/seed',
      component: () => import('layouts/UnAuthed.vue'),
      children: [
        { path: '', component: () => import('pages/Setup/Seed.vue') },
      ],
    },
    {
      path: '/setup/pin',
      component: () => import('layouts/UnAuthed.vue'),
      children: [
        { path: '', component: () => import('pages/Setup/Pin.vue') },
      ],
    },
    {
      path: '/wallet/balance',
      component: () => import('layouts/Authed.vue'),
      children: [
        { path: '', component: () => import('pages/Wallet/Balance.vue') },
      ],
    },
    {
      path: '/wallet/analytics',
      component: () => import('layouts/Authed.vue'),
      children: [
        { path: '', component: () => import('pages/Wallet/Analytics.vue') },
      ],
    },
    {
      path: '/wallet/payments',
      component: () => import('layouts/Authed.vue'),
      children: [
        { path: '', component: () => import('pages/Wallet/Payments.vue') },
      ],
    },
    {
      path: '/wallet/exchange',
      component: () => import('layouts/Authed.vue'),
      children: [
        { path: '', component: () => import('pages/Wallet/Exchange.vue') },
      ],
    },
    {
      path: '/wallet/more',
      component: () => import('layouts/Authed.vue'),
      children: [
        { path: '', component: () => import('pages/Wallet/More.vue') },
      ],
    },
    {
      path: '/UserProfile',

      component: () => import('pages/Profile/UserProfile.vue'),
      name: 'UserProfile',
    },
    {
      path: '/EditProfile',
      component: () => import('pages/Profile/EditProfile.vue'),
      name: 'editProfile',
    },
    {
      path: '/TxDetails',
      component: () => import('layouts/UnAuthed.vue'),
      children: [
        { path: '', component: () => import('pages/Transactions/TxDetails.vue') },
      ],
      name: 'TxDetails',
    },
    {
      path: '*',
      component: () => import('layouts/UnAuthed.vue'),
      children: [
        { path: '', component: () => import('pages/Error404.vue') },
      ],
    },
  ],

  mode: process.env.VUE_ROUTER_MODE,
  base: process.env.VUE_ROUTER_BASE,
});
