/* eslint-disable no-magic-numbers */
import { mount } from '@vue/test-utils';
import PinPad from '@/components/Auth/PinPad';
import { localVue, i18n } from '@/helpers/SetupLocalVue';
import { Quasar, QBtn } from 'quasar';
import Vuex from 'vuex';
import Keyboard from 'vue-keyboard';

describe('PinPad component', () => {
  let store;
  let mockSetupModule;

  localVue.use(Quasar, { components: { QBtn } });

  beforeEach(() => {
    mockSetupModule = {
      namespaced: true,
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
    expect(mockSetupModule.actions.resetPin).toHaveBeenCalled();
  });
  it('disables button when less than 6 characters have been entered', () => {
    const wrapper = mount(PinPad, {
      i18n,
      localVue,
      Keyboard,
      store,
      propsData: {
        mode: 'pin-setup',
      },
    });
    expect(wrapper.findAll('[disabled]').at(1)).toBeTruthy();
    expect(wrapper.vm.canProceed).toBe(true);
  });
  it('displays a delete button in delete mode', () => {
    const wrapper = mount(PinPad, {
      i18n,
      localVue,
      Keyboard,
      store,
      propsData: {
        mode: 'delete',
      },
    });
    expect(wrapper.findAll('[disabled]').at(1).text()).toBe('Delete');
  });
  describe('inputPin()', () => {
    it('calls the setup/setPin action in pin setup mode', (done) => {
      const wrapper = mount(PinPad, {
        i18n,
        localVue,
        Keyboard,
        store,
        propsData: {
          mode: 'pin-setup',
        },
      });
      const mockVibrate = jest.fn();
      global.navigator.vibrate = mockVibrate;
      wrapper.findAll('.vue-keyboard-key').at(1).trigger('click');
      wrapper.vm.$nextTick(() => {
        expect(mockSetupModule.actions.setPin).toHaveBeenCalled();
        done();
      });
    });
    it('calls the setup/setPinConfirm action in pin confirm mode', (done) => {
      const wrapper = mount(PinPad, {
        i18n,
        localVue,
        Keyboard,
        store,
        propsData: {
          mode: 'pin-confirm',
        },
      });
      global.navigator.vibrate = null;
      wrapper.findAll('.vue-keyboard-key').at(1).trigger('click');
      wrapper.vm.$nextTick(() => {
        expect(mockSetupModule.actions.setPinConfirm).toHaveBeenCalled();
        done();
      });
    });
    it('calls the setup/setPin action in pin setup mode', (done) => {
      const wrapper = mount(PinPad, {
        i18n,
        localVue,
        Keyboard,
        store,
        propsData: {
          mode: 'pin-setup',
        },
      });
      wrapper.findAll('.vue-keyboard-key').at(1).trigger('click');
      wrapper.vm.$nextTick(() => {
        expect(mockSetupModule.actions.setPin).toHaveBeenCalled();
        done();
      });
    });
    it('fires an inputPin event in access mode', () => {
      const wrapper = mount(PinPad, {
        i18n,
        localVue,
        Keyboard,
        store,
        propsData: {
          mode: 'access',
        },
      });
      wrapper.findAll('.vue-keyboard-key').at(1).trigger('click');
      expect(wrapper.emitted('inputPin')).toEqual([['2']]);
    });
  });
  describe('confirmPin()', () => {
    it('fires an attemptUnlock event in access mode', () => {
      const wrapper = mount(PinPad, {
        i18n,
        localVue,
        Keyboard,
        store,
        propsData: {
          mode: 'access',
        },
      });
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
      const wrapper = mount(PinPad, {
        i18n,
        localVue,
        Keyboard,
        store,
        propsData: {
          mode: 'auth',
        },
        parentComponent: Parent,
      });
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
      const wrapper = mount(PinPad, {
        i18n,
        localVue,
        Keyboard,
        store,
        propsData: {
          mode: 'pin-confirm',
        },
        parentComponent: Parent,
      });
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
      const $router = {
        push: jest.fn(),
      };
      const wrapper = mount(PinPad, {
        i18n,
        localVue,
        Keyboard,
        store,
        propsData: {
          mode: 'pin-setup',
        },
        mocks: {
          $router,
        },
      });
      const pinAray = [0, 0, 0, 0, 0, 0];
      pinAray.forEach((pin) => {
        if (pin === 0) { pin = 10; }
        wrapper.findAll('.vue-keyboard-key').at(pin - 1).trigger('click');
      });
      wrapper.findAll('.q-btn').at(1).trigger('click');
      expect($router.push).toHaveBeenCalled();
    });
    it('fires a newPinSet event in new-pin mode', () => {
      const $router = {
        push: jest.fn(),
      };
      const wrapper = mount(PinPad, {
        i18n,
        localVue,
        Keyboard,
        store,
        propsData: {
          mode: 'new-pin',
        },
        mocks: {
          $router,
        },
      });
      const pinAray = [0, 0, 0, 0, 0, 0];
      pinAray.forEach((pin) => {
        if (pin === 0) { pin = 10; }
        wrapper.findAll('.vue-keyboard-key').at(pin - 1).trigger('click');
      });
      wrapper.findAll('.q-btn').at(1).trigger('click');
      expect(wrapper.emitted('newPinSet')).toBeTruthy();
    });
    it('fires a attempConfirm event in confirm-new-pin mode', () => {
      const $router = {
        push: jest.fn(),
      };
      const wrapper = mount(PinPad, {
        i18n,
        localVue,
        Keyboard,
        store,
        propsData: {
          mode: 'confirm-new-pin',
        },
        mocks: {
          $router,
        },
      });
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
      const wrapper = mount(PinPad, {
        i18n,
        localVue,
        Keyboard,
        store,
        propsData: {
          mode: 'confirm-new-pin',
        },
      });
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
