import Quasar, * as All from 'quasar';
import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import VueI18n from 'vue-i18n';
import messages from '@/i18n/index.js';

const localVue = createLocalVue();

localVue.use(VueI18n);
localVue.use(Vuex);
localVue.use(Quasar, {
  components: All,
  directives: All,
  plugins: All,
});
localVue.use(VueRouter);

const router = new VueRouter();
const i18n = new VueI18n({ messages, locale: 'en-us' });

export {
  localVue,
  router,
  i18n,
};
