import Vuex from 'vuex';
import PinPad from '@/components/Auth/PinPad.vue';
import VueRouter from 'vue-router';
import { createLocalVue, shallowMount } from '@vue/test-utils';
import { __createMocks as createStoreMocks } from '../../../../store/__mocks__/store.js';

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueRouter);

describe('App.vue', () => {
  let storeMocks;
  let wrapper;
  let store;

  const stubs = {
    keyboard: "<keyboard-stub value=\"\" layouts=\"123|456|789|0|{delete:backspace}{!@£:goto:1},!@#|?%^|&amp;()|*|{delete:backspace}{123:goto:0}\" maxlength=\"0\"></keyboard-stub>",
  };

  function wrapperInit(options) {
    return shallowMount(PinPad, options);
  }

  function storeInit (custom) {
    storeMocks = createStoreMocks(custom);
    wrapper = wrapperInit({ localVue, PinPad, store: storeMocks.store, computed: {
      minLength: () => 6
    }});
    store = wrapper.vm.$store;
  }

  beforeEach(() => storeInit());

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('renders the correct markup', () => {
    expect(wrapper.html()).toContain(stubs.keyboard)
  })  

  it('min length should match ', () => {
    expect(wrapper.vm._computedWatchers.minLength.getter()).toBe(6)
  })
});
