import Sms from './index.js';
import { shallowMount } from '@vue/test-utils';
import { localVue, i18n } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';
import cordovaMocks from '@/cordovaMocks';
import { JSDOM } from 'jsdom';

const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;
global.document = window.document;

const store = createStoreMocks().store;
const wrapperMock = shallowMount({name: 'mock', template: '<div/>'}, { i18n, localVue, store });
let smsInstance;

beforeEach(() => {
  cordovaMocks.initMocks();
  Sms({ Vue: localVue });
  const event = new Event('deviceready');
  document.dispatchEvent(event);
  smsInstance = wrapperMock.vm.permissions.sms;
});

afterEach(() => cordovaMocks.destroyMocks());

describe('plugins/Permissions/Sms', () => {
  it('exports a function', () => {
    expect(typeof Sms === 'function').toBe(true);
  });

  it('adds sms Object into Vue.prototype.permissions Object', () => {
    expect(localVue.prototype.permissions.sms).toBeTruthy();
  });

  it('sets cordovaSms correctly on document "deviceready" event', () => {
    expect(localVue.prototype.permissions.sms.cordovaSms).toBeTruthy();
  });

  describe('detect()', () => {
    it('calls hasPermission on the cordovaSms plugin and returns a Promise', () => {
      smsInstance.cordovaSms.hasPermission = jest.fn();
      const result = smsInstance.detect();
      expect(result instanceof Promise).toBe(true);
      expect(smsInstance.cordovaSms.hasPermission).toHaveBeenCalled();
    });

    it('throws an error if the second callback is called', async () => {
      smsInstance.cordovaSms.hasPermissionBehaviour = 'error';
      try {
        await smsInstance.detect();
      } catch (err) {
        expect(err.message === 'mock error').toBe(true);
      }
    });
  });

  describe('request()', () => {
    it('calls requestPermission on the cordovaSms plugin and returns a Promise', () => {
      smsInstance.cordovaSms.requestPermission = jest.fn();
      const result = smsInstance.request();
      expect(result instanceof Promise).toBe(true);
      expect(smsInstance.cordovaSms.requestPermission).toHaveBeenCalled();
    });

    it('resolves to true if the first cordovaSms.requestPermission() callback was called', () => {
      smsInstance.cordovaSms.requestPermissionBehaviour = 'callback1';
      return smsInstance.request(false)
        .then((result) => {
          expect(result).toBe(true);
        });
    });

    it('resolves to false if the second cordovaSms.requestPermission() callback was called', () => {
      smsInstance.cordovaSms.requestPermissionBehaviour = 'callback2';
      return smsInstance.request(false)
        .then((result) => {
          expect(result).toBe(false);
        });
    });
  });
});
