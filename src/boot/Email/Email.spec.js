import Email from './index.js';
import { shallowMount } from '@vue/test-utils';
import { localVue, i18n } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';
import cordovaMocks from '@/cordovaMocks';

const store = createStoreMocks().store;
const wrapperMock = shallowMount({name: 'mock', template: '<div/>'}, { i18n, localVue, store });
let emailInstance;
let to = 'james@atlascity.io';
let body = 'Email body';
let subject = 'Email subject';

beforeEach(() => {
  cordovaMocks.initMocks();
  emailInstance = new wrapperMock.vm.Email({
    to,
    body,
    subject,
    vm: wrapperMock.vm,
  });
});

afterEach(() => cordovaMocks.destroyMocks());

describe('plugins/Email', () => {
  it('exports a function', () => {
    expect(typeof Email === 'function').toBe(true);
  });

  describe('send()', () => {
    it('calls vm.permissions.email.detect()', async () => {
      const detectMock = jest.fn(() => true);
      const requestMock = jest.fn(() => false);
      const hasConfiguredEmailMock = jest.fn(() => false);
      wrapperMock.vm.permissions.email.detect = detectMock;
      wrapperMock.vm.permissions.email.request = requestMock;
      wrapperMock.vm.permissions.email.hasConfiguredEmail = hasConfiguredEmailMock;

      await emailInstance.send();
      expect(detectMock).toHaveBeenCalled();
    });

    it('calls vm.permissions.email.request() if it has no permissions', async () => {
      const createMock = jest.fn();
      const detectMock = jest.fn(() => false);
      const requestMock = jest.fn(() => true);
      const hasConfiguredEmailMock = jest.fn(() => false);
      wrapperMock.vm.$toast.create = createMock;
      wrapperMock.vm.permissions.email.detect = detectMock;
      wrapperMock.vm.permissions.email.request = requestMock;
      wrapperMock.vm.permissions.email.hasConfiguredEmail = hasConfiguredEmailMock;

      await emailInstance.send();
      expect(requestMock).toHaveBeenCalled();
    });

    it('creates a toast if it has no permissions', async () => {
      const createMock = jest.fn();
      const detectMock = jest.fn(() => false);
      const requestMock = jest.fn(() => false);
      wrapperMock.vm.$toast.create = createMock;
      wrapperMock.vm.permissions.email.detect = detectMock;
      wrapperMock.vm.permissions.email.request = requestMock;

      await emailInstance.send();
      expect(createMock.mock.calls[0][1] === wrapperMock.vm.$t('needsEmailPermissions')).toBe(true);
    });


    it('creates a toast if email account is not available', async () => {
      const createMock = jest.fn();
      const detectMock = jest.fn(() => false);
      const requestMock = jest.fn(() => true);
      const hasConfiguredEmailMock = jest.fn(() => false);
      wrapperMock.vm.$toast.create = createMock;
      wrapperMock.vm.permissions.email.detect = detectMock;
      wrapperMock.vm.permissions.email.request = requestMock;
      wrapperMock.vm.permissions.email.hasConfiguredEmail = hasConfiguredEmailMock;

      await emailInstance.send();
      expect(createMock.mock.calls[0][1] === wrapperMock.vm.$t('needsEmailAccount')).toBe(true);
    });

    it('calls open() on the email cordova plugin', async () => {
      const createMock = jest.fn();
      const detectMock = jest.fn(() => true);
      const requestMock = jest.fn(() => true);
      const hasConfiguredEmailMock = jest.fn(() => true);
      wrapperMock.vm.$toast.create = createMock;
      wrapperMock.vm.permissions.email.detect = detectMock;
      wrapperMock.vm.permissions.email.request = requestMock;
      wrapperMock.vm.permissions.email.hasConfiguredEmail = hasConfiguredEmailMock;

      await emailInstance.send();
      expect(emailInstance.email.open).toHaveBeenCalled();
    });


  });


 /* describe('detectPermissions()', () => {
    it('calls hasPermission on the email cordova plugin and returns a Promise', () => {
      emailInstance.email.hasPermission = jest.fn();
      const result = emailInstance.detectPermissions();
      expect(result instanceof Promise).toBe(true);
      expect(emailInstance.email.hasPermission).toHaveBeenCalled();
    });
  });

  describe('requestPermission()', () => {
    it('returns a Promise and resolves to TRUE if called with TRUE', () => {
      emailInstance.requestPermission(true)
        .then((result) => {
          expect(result).toBe(true);
        });
    });

    it('returns a Promise and calls requestPermission on the email cordova plugin if called with FALSE', () => {
      emailInstance.email.requestPermissionBehaviour = 'grant';
      emailInstance.requestPermission(false)
        .then((result) => {
          expect(result).toBe(true);
        });
    });
  });

  describe('hasConfiguredEmail()', () => {
    it('resolves to FALSE and creates a toast if called with FALSE', async () => {
      let result;
      const createMock = jest.fn();
      wrapperMock.vm.$toast.create = createMock;

      emailInstance.hasConfiguredEmail(false)
        .then((boolean) => {
          result = boolean;
        });

      await flushPromises();
      expect(result).toBe(false);
      expect(createMock.mock.calls[0][1] === wrapperMock.vm.$t('needsEmailPermissions')).toBe(true);
    });

    it('calls isAvailable() on the email cordova plugin if calle with TRUE', async () => {
      const isAvailableMock = jest.fn();
      emailInstance.email.isAvailable = isAvailableMock;
      emailInstance.hasConfiguredEmail(true);
      await flushPromises();
      expect(isAvailableMock).toHaveBeenCalled();
    });

    it('resolves to false and creates a toast if email account is not available', async () => {
      let result;
      const createMock = jest.fn();
      wrapperMock.vm.$toast.create = createMock;

      emailInstance.email.isAvailableBehaviour = 'no';
      emailInstance.hasConfiguredEmail(true)
        .then((boolean) => {
          result = boolean;
        });

      await flushPromises();
      expect(result).toBe(false);
      expect(createMock.mock.calls[0][1] === wrapperMock.vm.$t('needsEmailAccount')).toBe(true);
    });

    it('resolves to true if email account is available', async () => {
      let result;
      emailInstance.email.isAvailableBehaviour = 'yes';
      emailInstance.hasConfiguredEmail(true)
        .then((boolean) => {
          result = boolean;
        });

      await flushPromises();
      expect(result).toBe(true);
    });

  });

  describe('send()', () => {
    it('calls detectPermissions() then requestPermission() then hasConfiguredEmail()', async () => {
      const detectPermissionsMock = jest.fn(() => {
        return new Promise((resolve) => resolve(true));
      });

      const requestPermissionMock = jest.fn(() => {
        return new Promise((resolve) => resolve(true));
      });

      const hasConfiguredEmailMock = jest.fn(() => {
        return new Promise((resolve) => resolve(true));
      });

      emailInstance.detectPermissions = detectPermissionsMock;
      emailInstance.requestPermission = requestPermissionMock;
      emailInstance.hasConfiguredEmail = hasConfiguredEmailMock;

      emailInstance.send();
      await flushPromises();

      expect(detectPermissionsMock).toHaveBeenCalled();
      expect(requestPermissionMock).toHaveBeenCalled();
      expect(hasConfiguredEmailMock).toHaveBeenCalled();
    });

    it('calls open() on the email cordova plugin if the last Promise returns TRUE', async () => {
      emailInstance.email.requestPermissionBehaviour = 'grant';
      emailInstance.email.isAvailableBehaviour = 'yes';
      const result = emailInstance.send();
      await flushPromises();
      expect(emailInstance.email.open).toHaveBeenCalled();
    });

    it('doesn\'t calls open() on the email cordova plugin if the last Promise returns FALSE', async () => {
      emailInstance.email.requestPermissionBehaviour = 'grant';
      emailInstance.email.isAvailableBehaviour = 'no';
      const result = emailInstance.send();
      await flushPromises();
      expect(emailInstance.email.open).toHaveBeenCalledTimes(0);
    });

    it('creates a toast if encountered an error', async () => {
      const createMock = jest.fn();
      wrapperMock.vm.$toast.create = createMock;

      const requestPermissionMock = jest.fn(() => {
        throw new Error('mock error');
      });

      emailInstance.requestPermission = requestPermissionMock;
      const result = emailInstance.send();
      await flushPromises();
      expect(createMock.mock.calls[0][1]).toBe('ERROR mock error');
    });
  });*/
});
