/*eslint-disable*/

import { shallowMount } from '@vue/test-utils';
import Splash from '@/pages/Setup/Steps/Splash';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';

describe('Splash Setup', () => {
  let wrapper;
  let router;
  let store;
  let storeMocks;

  const propsData = {};

  function wrapperInit (options) {
    return shallowMount(Splash, options);
  }

  function storeInit (custom) {
    storeMocks = createStoreMocks(custom);
    router = createRouter(storeMocks.store);
    router.push({ path: `/setup/0` });
    wrapper = wrapperInit({ i18n, router, localVue, store: storeMocks.store, propsData });
    store = wrapper.vm.$store;
  }

  beforeEach(() => storeInit());

  it('renders and matches snapshot', () => {

    console.log(wrapper.html());

    expect(wrapper.element).toMatchSnapshot();
  });
});
