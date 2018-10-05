import Quasar, * as All from 'quasar';
import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';
const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(Quasar, {components: All, directives: All, plugins: All});

export {
  localVue
};