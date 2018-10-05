import Quasar, * as All from 'quasar';
import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import Router from 'vue-router';
const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(Quasar, {components: All, directives: All, plugins: All});
localVue.use(Router);

export {
  localVue
};