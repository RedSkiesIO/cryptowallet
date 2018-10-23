import Quasar, * as All from 'quasar';
import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import VueI18n from 'vue-i18n'
import messages from '@/i18n/index.js';
import axios from 'axios';
/**
 * vuex-router-sync has to be mocked in order to test /plugins/vuexRouterSync.js
 * but in this file, an actual module is needed, not the mocked one
 * both jest.unmock() and require.requireActual() are needed to achive this
 */
jest.unmock('vuex-router-sync');
const sync = require.requireActual('vuex-router-sync').sync;

const localVue = createLocalVue();

localVue.use(VueI18n)
localVue.use(Vuex);
localVue.use(Quasar, {components: All, directives: All, plugins: All});
localVue.use(VueRouter);
localVue.prototype.$axios = axios;

/**
 * creates a new router and syncs it with the store using vuex-router-sync
 * @param store
 * @returns router
 */
const createRouter = function(store = null) {
  const router = new VueRouter({
    routes: [
      {
        path: '/contact-item/:id',
      },
    ]
  });

  if (store) sync(store, router);
  return router;
}


const i18n = new VueI18n({messages, locale: 'en-us'});

export {
  localVue,
  createRouter,
  i18n,
};
