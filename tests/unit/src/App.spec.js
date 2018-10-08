import Vuex from 'vuex';
import App from '@/App.vue';
import VueRouter from 'vue-router';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import { __createMocks as createStoreMocks } from '../../store/__mocks__/store.js';

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueRouter);

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
