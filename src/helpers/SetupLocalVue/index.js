import Quasar, * as All from 'quasar';
import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import VueI18n from 'vue-i18n';
import messages from '@/i18n/';
import axios from 'axios';
import { sync } from 'vuex-router-sync';
import errorHandler from '@/plugins/ErrorHandler';

const localVue = createLocalVue();

localVue.use(VueI18n);
localVue.use(Vuex);
localVue.use(Quasar, { components: All, directives: All, plugins: All });
localVue.use(VueRouter);
localVue.prototype.$axios = axios;
errorHandler({ Vue: localVue });

/**
 * creates a new router and syncs it with the store using vuex-router-sync
 * @param store
 * @returns router
 */
const createRouter = (store = null) => {
  const router = new VueRouter({
    routes: [
      {
        path: '/contact-item/:id',
      },
    ],
  });

  if (store) sync(store, router);
  return router;
};

const i18n = new VueI18n({ messages, locale: 'en-gb' });

export {
  localVue,
  createRouter,
  i18n,
};
