import { shallowMount } from '@vue/test-utils';
import PinConfirm from '@/pages/Setup/Steps/Pin/Confirm';
import { localVue, i18n } from '@/helpers/SetupLocalVue';
import Vuex from 'vuex';
import Keyboard from 'vue-keyboard';
import { Quasar, QBtn } from 'quasar';


describe('Pin Confirm', () => {
  let wrapper;
  let store;
  let mockSetupModule;
  let $router;

  localVue.use(Quasar, { components: { QBtn } });

  beforeEach(() => {
    mockSetupModule = {
      namespaced: true,
      state: {
        pinArray: [0, 0, 0, 0, 0, 0],
        pinConfirmArray: [0, 0, 0, 0, 0, 0],
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
    $router = {
      push: jest.fn(),
    };
    wrapper = shallowMount(PinConfirm, {
      i18n,
      localVue,
      store,
      Keyboard,
      mocks: {
        $router,
      },
    });
  });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('routes to next step in setup if pins match', () => {
    wrapper.vm.validatePin();
    expect($router.push).toHaveBeenCalled();
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
      mocks: {
        $router,
      },
    });
    wrapper.vm.$toast.create = jest.fn();
    w.vm.validatePin();
    expect(wrapper.vm.$toast.create).toHaveBeenCalled();
  });
});
