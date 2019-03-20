import SMS from './index.js';
import { shallowMount } from '@vue/test-utils';
import { localVue, i18n } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';
import cordovaMocks from '@/cordovaMocks';
import flushPromises from 'flush-promises';

const store = createStoreMocks().store;
const wrapperMock = shallowMount({name: 'mock', template: '<div/>'}, { i18n, localVue, store });
const contact = store.state.contacts.contacts[0];
let smsInstance;

const number = 123123;
const message = 'magic test message';
const manual = true;

beforeEach(() => {
  cordovaMocks.initMocks();
  smsInstance = new wrapperMock.vm.SMS({
    number,
    message,
    manual,
    vm: wrapperMock.vm,
  });
});

afterEach(() => cordovaMocks.destroyMocks());

describe('plugins/Sms', () => {
  it('exports a function', () => {
    expect(typeof SMS === 'function').toBe(true);
  });

  it('sets manual option correctly', () => {
    expect(manual).toBe(true);
    expect(smsInstance.options.android.intent).toBe('INTENT');

    smsInstance = new wrapperMock.vm.SMS({
      number,
      message,
      vm: wrapperMock.vm,
    });

    expect(smsInstance.options.android.intent).toBe('');
  });

  describe('send()', () => {
    it('calls vm.permissions.sms.detect()', async () => {
      const createMock = jest.fn();
      const detectMock = jest.fn(() => true);
      const requestMock = jest.fn(() => false);
      wrapperMock.vm.$toast.create = createMock;
      wrapperMock.vm.permissions.sms.detect = detectMock;
      wrapperMock.vm.permissions.sms.request = requestMock;

      await smsInstance.send();
      expect(detectMock).toHaveBeenCalled();
    });

    it('calls vm.permissions.sms.request() if it has no permissions', async () => {
      const createMock = jest.fn();
      const detectMock = jest.fn(() => true);
      const requestMock = jest.fn(() => false);
      wrapperMock.vm.$toast.create = createMock;
      wrapperMock.vm.permissions.sms.detect = detectMock;
      wrapperMock.vm.permissions.sms.request = requestMock;

      await smsInstance.send();
      expect(requestMock).toHaveBeenCalledTimes(0);

      wrapperMock.vm.permissions.sms.detect = jest.fn(() => false);
      await smsInstance.send();
      expect(requestMock).toHaveBeenCalledTimes(1);
    });

    it('opens a toast if it has no permissions', async () => {
      const createMock = jest.fn();
      const detectMock = jest.fn(() => false);
      const requestMock = jest.fn(() => false);
      wrapperMock.vm.$toast.create = createMock;
      wrapperMock.vm.permissions.sms.detect = detectMock;
      wrapperMock.vm.permissions.sms.request = requestMock;

      await smsInstance.send();
      expect(createMock.mock.calls[0][1] === wrapperMock.vm.$t('needsSmsPermissions')).toBe(true);
    });

    it('calls sms.send() with correct parameters if has permissions', async () => {
      const detectMock = jest.fn(() => true);
      const sendMock = jest.fn();
      wrapperMock.vm.permissions.sms.detect = detectMock;
      sms.send = sendMock;
      sms.hasPermissionBehaviour = 'failure';
      sms.requestPermissionBehaviour = 'callback1';

      await smsInstance.send();
      expect(sendMock).toHaveBeenCalled();
      expect(sendMock.mock.calls[0][0] === number).toBe(true);
      expect(sendMock.mock.calls[0][1] === message).toBe(true);
    });

    it('throws an error when second sms.send() callback is called and creates a toast', async () => {
      const createMock = jest.fn();
      const detectMock = jest.fn(() => true);
      wrapperMock.vm.$toast.create = createMock;
      wrapperMock.vm.permissions.sms.detect = detectMock;
      sms.hasPermissionBehaviour = 'failure';
      sms.requestPermissionBehaviour = 'callback1';
      sms.sendBehaviour = 'error';

      await smsInstance.send();
      expect(createMock.mock.calls[0][1] === 'ERROR mock error').toBe(true);
    });
  });
});
