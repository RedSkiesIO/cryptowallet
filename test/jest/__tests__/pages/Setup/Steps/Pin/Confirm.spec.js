import { shallowMount } from '@vue/test-utils';
import PinConfirm from '@/pages/Setup/Steps/Pin/Confirm';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';
import Vuex from 'vuex';
import Keyboard from 'vue-keyboard';


describe('Pin Confirm', () => {
  let wrapper;
  let store;
  let mockSetupModule;
  let storeMocks;
  let router;
  const propsData = {};

  function wrapperInit(options) {
    return shallowMount(PinConfirm, options);
  }

  function storeInit(custom) {
    storeMocks = createStoreMocks(custom);
    router = createRouter(storeMocks.store);
    router.push({ path: '/setup/4' });
    wrapper = wrapperInit({
      i18n,
      router,
      localVue,
      propsData,
      store: storeMocks.store,
    });
    store = wrapper.vm.$store;
  }

  beforeEach(() => { storeInit(); });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('routes to next step in setup if pins match', () => {
    wrapper.vm.validatePin();
    expect(store.state.route.path).toBe('/setup/5');
  });
  it('displays an error toast if pins don\'t match', () => {
    mockSetupModule = {
      namespaced: true,
      state: {
        pinArray: [0, 0, 0, 0, 0, 0],
        pinConfirmArray: [0, 0, 0, 0, 0, 1],
        salt: '$2a$10$KE86k38NXlqTBgOQUC9bE.',
      },
    };
    store = new Vuex.Store({
      modules: {
        setup: mockSetupModule,
      },
      state: {
        route: {
          params: {
            id: 4,
          },
        },
        settings: {
          pin: {
            minLength: 6,
          },
          delay: 500,
        },
      },
    });
    const w = shallowMount(PinConfirm, {
      i18n,
      localVue,
      store,
      Keyboard,
    });
    wrapper.vm.$toast.create = jest.fn();
    w.vm.validatePin();
    expect(wrapper.vm.$toast.create).toHaveBeenCalled();
  });
});
