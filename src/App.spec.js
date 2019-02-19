import Vuex from 'vuex';
import App from '@/App.vue';
import { shallowMount } from '@vue/test-utils';
import { createMocks as createStoreMocks } from '../../store/__mocks__/store.js';
import { localVue, i18n, createRouter } from '@/../tests/unit/helpers/setupLocalVue.js';


describe('App.vue', () => {
  let storeMocks;
  let wrapper;
  let store;

  const stubs = {
    QApp: '<div id="q-app"><transition name="fade" mode="out-in"><router-view></router-view></transition></div>',
  };

  function wrapperInit(options) {
    return shallowMount(App, options);
  }

  function storeInit (custom) {
    storeMocks = createStoreMocks(custom);
    wrapper = wrapperInit({ localVue, stubs, store: storeMocks.store });
    store = wrapper.vm.$store;
  }

  beforeEach(() => storeInit());

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('expect q-app', () => {
    expect(wrapper.contains('div#q-app')).toBe(true);
  });
});
