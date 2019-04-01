/* eslint-disable no-magic-numbers */
import { mount, createWrapper } from '@vue/test-utils';
import PinPad from '@/components/Auth/PinPad';
import Keyboard from 'vue-keyboard';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';

describe('PinPad component', () => {
  let wrapper;
  let router;
  let store;
  let storeMocks;

  const defaultProps = {
    mode: 'pin-setup',
  };

  function wrapperInit(options) {
    return mount(PinPad, options);
  }

  function storeInit(custom, propsData, parentComponent = null) {
    storeMocks = createStoreMocks(custom);
    router = createRouter(storeMocks.store);
    router.push({ path: '/setup/0' });
    wrapper = wrapperInit({
      i18n,
      router,
      localVue,
      Keyboard,
      propsData,
      parentComponent,
      store: storeMocks.store,
    });
    store = wrapper.vm.$store;
  }

  beforeEach(() => { storeInit({}, defaultProps); });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('disables button when less than 6 characters have been entered', () => {
    expect(wrapper.findAll('[disabled]').at(1)).toBeTruthy();
    expect(wrapper.vm.canProceed).toBe(true);
  });

  it('displays a delete button when in delete mode', () => {
    storeInit({}, { mode: 'delete' });
    expect(wrapper.findAll('[disabled]').at(1).text()).toBe('Delete');
  });

  describe('inputPin()', () => {
    it('calls the setup/setPin action in pin setup mode', (done) => {
      const mockVibrate = jest.fn();
      global.navigator.vibrate = mockVibrate;

      wrapper.findAll('.vue-keyboard-key').at(1).trigger('click');
      wrapper.vm.$nextTick(() => {
        expect(storeMocks.actions.setPin).toHaveBeenCalled();
        done();
      });
    });

    it('calls the setup/setPinConfirm action in pin confirm mode', (done) => {
      storeInit({}, { mode: 'pin-confirm' });
      global.navigator.vibrate = null;
      wrapper.findAll('.vue-keyboard-key').at(1).trigger('click');
      wrapper.vm.$nextTick(() => {
        expect(storeMocks.actions.setPinConfirm).toHaveBeenCalled();
        done();
      });
    });

    it('fires an inputPin event in access mode', () => {
      storeInit({}, { mode: 'access' });
      wrapper.findAll('.vue-keyboard-key').at(1).trigger('click');
      expect(wrapper.emitted('inputPin')).toEqual([['2']]);
    });

    it('fires an inputPin event in auth mode', () => {
      const Parent = {
        data: () => {
          return {
            val: true,
          };
        },
        methods: {
          resetPin: jest.fn(),
          attemptUnlock: jest.fn(),
        },
        template: '<div />',
      };

      storeInit({}, { mode: 'auth' }, Parent);
      wrapper.findAll('.vue-keyboard-key').at(1).trigger('click');
      const rootWrapper = createWrapper(wrapper.vm.$root);
      expect(rootWrapper.emitted('inputPin')).toEqual([['2']]);
    });
  });

  describe('confirmPin()', () => {
    it('fires an attemptUnlock event in access mode', () => {
      storeInit({}, { mode: 'access' });
      const pinAray = [0, 0, 0, 0, 0, 0];
      pinAray.forEach((pin) => {
        if (pin === 0) { pin = 10; }
        wrapper.findAll('.vue-keyboard-key').at(pin - 1).trigger('click');
      });
      wrapper.findAll('.q-btn').at(1).trigger('click');
      expect(wrapper.emitted('attemptUnlock')).toBeTruthy();
    });

    it('fires an attemptUnlock event in delete mode', () => {
      storeInit({}, { mode: 'delete' });
      const pinAray = [0, 0, 0, 0, 0, 0];
      pinAray.forEach((pin) => {
        if (pin === 0) { pin = 10; }
        wrapper.findAll('.vue-keyboard-key').at(pin - 1).trigger('click');
      });
      wrapper.findAll('.q-btn').at(1).trigger('click');
      expect(wrapper.emitted('attemptUnlock')).toBeTruthy();
    });

    it('calls attemptUnlock in parent function in auth mode', () => {
      const Parent = {
        data: () => {
          return {
            val: true,
          };
        },
        methods: {
          resetPin: jest.fn(),
          attemptUnlock: jest.fn(),
        },
        template: '<div />',
      };

      storeInit({}, { mode: 'auth' }, Parent);
      const pinAray = [0, 0, 0, 0, 0, 0];
      pinAray.forEach((pin) => {
        if (pin === 0) { pin = 10; }
        wrapper.findAll('.vue-keyboard-key').at(pin - 1).trigger('click');
      });
      wrapper.findAll('.q-btn').at(1).trigger('click');
      expect(Parent.methods.attemptUnlock).toHaveBeenCalled();
    });

    it('calls validatePin in parent function in pin-confirm mode', () => {
      const Parent = {
        data: () => {
          return {
            val: true,
          };
        },
        methods: {
          resetPin: jest.fn(),
          validatePin: jest.fn(),
        },
        template: '<div />',
      };

      storeInit({}, { mode: 'pin-confirm' }, Parent);
      const pinAray = [0, 0, 0, 0, 0, 0];
      pinAray.forEach((pin) => {
        if (pin === 0) { pin = 10; }
        wrapper.findAll('.vue-keyboard-key').at(pin - 1).trigger('click');
      });
      wrapper.findAll('.q-btn').at(1).trigger('click');
      expect(Parent.methods.validatePin).toHaveBeenCalled();
    });
  });


  describe('done()', () => {
    it('routes to the pin confirm screen when the done button is clicked in pin-setup mode', () => {
      const page = parseInt(store.state.route.params.id, 10);
      storeInit({}, { mode: 'pin-setup' });
      const pinAray = [0, 0, 0, 0, 0, 0];
      pinAray.forEach((pin) => {
        if (pin === 0) { pin = 10; }
        wrapper.findAll('.vue-keyboard-key').at(pin - 1).trigger('click');
      });
      wrapper.findAll('.q-btn').at(1).trigger('click');
      expect(parseInt(store.state.route.params.id, 10)).toBe(page + 1);
    });

    it('fires a newPinSet event in new-pin mode', () => {
      storeInit({}, { mode: 'new-pin' });
      const pinAray = [0, 0, 0, 0, 0, 0];
      pinAray.forEach((pin) => {
        if (pin === 0) { pin = 10; }
        wrapper.findAll('.vue-keyboard-key').at(pin - 1).trigger('click');
      });
      wrapper.findAll('.q-btn').at(1).trigger('click');
      expect(wrapper.emitted('newPinSet')).toBeTruthy();
    });

    it('fires a attempConfirm event in confirm-new-pin mode', () => {
      storeInit({}, { mode: 'confirm-new-pin' });
      const pinAray = [0, 0, 0, 0, 0, 0];
      pinAray.forEach((pin) => {
        if (pin === 0) { pin = 10; }
        wrapper.findAll('.vue-keyboard-key').at(pin - 1).trigger('click');
      });
      wrapper.findAll('.q-btn').at(1).trigger('click');
      expect(wrapper.emitted('attemptConfirm')).toBeTruthy();
    });
  });

  describe('resetState()', () => {
    it('clears the internal input state when called', () => {
      storeInit({}, { mode: 'confirm-new-pin' });
      const pinAray = [0, 0, 0, 0, 0, 0];
      pinAray.forEach((pin) => {
        if (pin === 0) { pin = 10; }
        wrapper.findAll('.vue-keyboard-key').at(pin - 1).trigger('click');
      });
      expect(wrapper.vm.input.length).toEqual(6);
      wrapper.vm.resetState();
      expect(wrapper.vm.input.length).toEqual(0);
    });
  });
});
