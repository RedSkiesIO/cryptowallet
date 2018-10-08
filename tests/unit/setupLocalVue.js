import Quasar, * as All from 'quasar';
import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import Router from 'vue-router';
import VueI18n from 'vue-i18n'

const localVue = createLocalVue();

localVue.use(VueI18n)
localVue.use(Vuex);
localVue.use(Quasar, {components: All, directives: All, plugins: All});
localVue.use(Router);

export {
  localVue
};