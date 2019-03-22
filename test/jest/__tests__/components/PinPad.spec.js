import { mount } from '@vue/test-utils';
import PinPad from '@/components/Auth/PinPad';
import { localVue, i18n } from '@/helpers/SetupLocalVue';
import { Quasar, QBtn } from 'quasar';
import Vuex from 'vuex';
import Keyboard from 'vue-keyboard';

describe('PinPad component', () => {
  let wrapper;
  let store;
  let actions;

  localVue.use(Quasar, { components: { QBtn } });

  beforeEach(() => {
    actions = {
      'setup/resetPin': jest.fn(),
      'setup/resetPinConfirm': jest.fn(),
      'setup/setPinConfirm': jest.fn(),
      'setup/setPin': jest.fn(),
    };
    store = new Vuex.Store({
      state: {
        route: {
          params: {
            id: 4,
          },
        },
        setup: {
          pinArray: [0, 0, 0, 0, 0, 0],
          pinConfirmArray: [0, 0, 0, 0, 0, 0],
          salt: '$2a$10$KE86k38NXlqTBgOQUC9bE.',
        },
        settings: {
          pin: {
            minLength: 6,
          },
          delay: 500,
        },
      },
      actions,
    });
    wrapper = mount(PinPad, {
      i18n,
      localVue,
      Keyboard,
      store,
      propsData: {
        mode: 'pin-setup',
      },
    });
  });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
    expect(actions['setup/resetPin']).toHaveBeenCalled();
  });
  describe('inputPin()', () => {
    it('calls the setup/setPin action in pin setup mode', () => {
      // wrapper.findAll('.vue-keyboard-key').at(9).trigger();
      console.log(wrapper.contains('.vue-keyboard'));
    });
  });
});
