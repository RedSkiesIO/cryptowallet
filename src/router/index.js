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
        { path: '', component: () => import('components/ProfileButton.vue') },
      ],
    },
    {
      path: '/setup',
      component: () => import('layouts/UnAuthed.vue'),
      children: [
        { path: '', component: () => import('pages/Setup.vue') },
      ],
    },
    {
      path: '/balance',
      component: () => import('layouts/Authed.vue'),
      children: [
        { path: '', component: () => import('pages/Balance.vue') },
      ],
    },
    {
      path: '/UserProfile',
      name: 'UserProfile',
      component: () => import('pages/UserProfile.vue'),
    },
    {
      path: '/EditProfile',
      name: 'editProfile',
      component: () => import('pages/EditProfile.vue'),
    },
    {
      path: '*',
      component: () => import('layouts/UnAuthed.vue'),
      children: [
        { path: '', component: () => import('pages/Error404.vue') },
      ],
    },
  ],

  // Leave these as is and change from quasar.conf.js instead!
  // quasar.conf.js -> build -> vueRouterMode
  mode: process.env.VUE_ROUTER_MODE,
  base: process.env.VUE_ROUTER_BASE,
});
