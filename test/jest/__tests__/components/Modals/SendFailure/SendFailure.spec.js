/* eslint-disable */
import { mount, createWrapper } from '@vue/test-utils';
import SendFailure from '@/components/Modals/SendFailure';
import { localVue, i18n } from '@/helpers/SetupLocalVue';
import { Quasar, QDialog } from 'quasar';
import Vuex from 'vuex';

describe('SendFailure component', () => {
  let store;
  let mockSetupModule;

  localVue.use(Quasar, { components: { QDialog } });

  beforeEach(() => {
    mockSetupModule = {
/*      namespaced: true,
      state: {
        pinArray: [0, 0, 0, 0, 0, 0],
        pinConfirmArray: [0, 0, 0, 0, 0, 0],
        salt: '$2a$10$KE86k38NXlqTBgOQUC9bE.',
      },
      actions: {
        resetPin: jest.fn(),
        resetPinConfirm: jest.fn(),
        setPinConfirm: jest.fn(),
        setPin: jest.fn(),
      },*/
    };

    store = new Vuex.Store({
      modules: {
        setup: mockSetupModule,
      },
      state: {
        /*route: {
          params: {
            id: 4,
          },
        },
        settings: {
          pin: {
            minLength: 6,
          },
          delay: 500,
        },*/
      },
    });
  });

  it('renders and matches snapshot', () => {
    const wrapper = mount(PinPad, {
      i18n,
      localVue,
      Keyboard,
      store,
      propsData: {
        mode: 'pin-setup',
      },
    });
    expect(wrapper.element).toMatchSnapshot();
  });


});
