import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

export default new VueRouter({
  /**
   * Gets scroll position
   * @returns {{y: number}}
   */
  scrollBehavior: () => ({ y: 0 }),

  routes: [
    {
      path: '/',
      component: () => import('layouts/UnAuthed'),
      children: [
        { path: '', component: () => import('pages/Auth/Login') },
      ],
    },
    {
      path: '/setup',
      component: () => import('layouts/UnAuthed'),
      children: [
        { path: '', component: () => import('pages/Setup') },
      ],
    },
    {
      path: '/wallet',
      component: () => import('layouts/Authed'),
      children: [
        { path: '', component: () => import('pages/Wallet') },
      ],
    },
    {
      path: '/wallet/balance/:uid',
      component: () => import('layouts/Authed'),
      children: [
        { path: '', component: () => import('pages/Balance') },
      ],
    },
    {
      path: '/wallet/analytics',
      component: () => import('layouts/Authed'),
      children: [
        { path: '', component: () => import('pages/Analytics') },
      ],
    },
    {
      path: '/wallet/payments',
      component: () => import('layouts/Authed'),
      children: [
        { path: '', component: () => import('pages/Payments') },
      ],
    },
    {
      path: '/wallet/exchange',
      component: () => import('layouts/Authed'),
      children: [
        { path: '', component: () => import('pages/Exchange') },
      ],
    },
    {
      path: '/wallet/more',
      component: () => import('layouts/Authed'),
      children: [
        { path: '', component: () => import('pages/More') },
      ],
    },
    {
      path: '/contact/:id',
      component: () => import('layouts/Authed'),
      children: [
        { path: '', component: () => import('pages/Contact') },
      ],
    },
    {
      path: '/UserProfile',
      component: () => import('pages/Profile/UserProfile'),
      name: 'UserProfile',
    },
    {
      path: '/EditProfile',
      component: () => import('pages/Profile/EditProfile'),
      name: 'editProfile',
    },
    {
      path: '/TxDetails',
      component: () => import('layouts/UnAuthed'),
      children: [
        { path: '', component: () => import('pages/TxDetails') },
      ],
      name: 'TxDetails',
    },
    {
      path: '*',
      component: () => import('layouts/UnAuthed'),
      children: [
        { path: '', component: () => import('pages/Error/404') },
      ],
    },
  ],

  mode: process.env.VUE_ROUTER_MODE,
  base: process.env.VUE_ROUTER_BASE,
});
