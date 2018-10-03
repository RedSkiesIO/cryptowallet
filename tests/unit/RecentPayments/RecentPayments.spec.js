import { shallowMount, createLocalVue } from '@vue/test-utils';
import RecentPayments from '@/components/RecentPayments/RecentPayments.vue';
import Vuex from 'vuex';

import { __createMocks as createStoreMocks } from '../../../src/store/__mocks__/store.js';
const localVue = createLocalVue();
localVue.use(Vuex);

describe('RecentPayments.vue', () => {
  let storeMocks;
  let wrapper;
  let store;

  function wrapperInit (options) {
    return shallowMount(RecentPayments, options);
  }

  function storeInit (custom) {
    storeMocks = createStoreMocks(custom);
    wrapper = wrapperInit({ localVue, store: storeMocks.store });
    store = wrapper.vm.$store;
  }

  beforeEach(() => storeInit());

  it('tests', () => {

  });

/*
  const propsData = {

  };

  const stubs = {
    ToDoItem: '<li></li>',
  };

  function wrapperInit (options) {
    return shallowMount(Main, options);
  }

  it('renders and matches snapshot', () => {

  });
*/

});
