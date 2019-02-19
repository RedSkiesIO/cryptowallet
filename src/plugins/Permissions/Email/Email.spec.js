import Email from './index.js';
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
let emailInstance;

beforeEach(() => {
  cordovaMocks.initMocks();
  Email({ Vue: localVue });
  const event = new Event('deviceready');
  document.dispatchEvent(event);
  emailInstance = wrapperMock.vm.permissions.email;
});

afterEach(() => cordovaMocks.destroyMocks());

describe('plugins/Permissions/Email', () => {
  it('exports a function', () => {
    expect(typeof Email === 'function').toBe(true);
  });

  it('adds email Object into Vue.prototype.permissions Object', () => {
    expect(localVue.prototype.permissions.email).toBeTruthy();
  });

  it('sets cordovaEmail correctly on document "deviceready" event', () => {
    expect(localVue.prototype.permissions.email.cordovaEmail).toBeTruthy();
  });

  describe('detect()', () => {
    it('calls hasPermission on the cordovaEmail plugin and returns a Promise', () => {
      emailInstance.cordovaEmail.hasPermission = jest.fn();
      const result = emailInstance.detect();
      expect(result instanceof Promise).toBe(true);
      expect(emailInstance.cordovaEmail.hasPermission).toHaveBeenCalled();
    });
  });

  describe('request()', () => {
    it('calls requestPermission on the cordovaEmail plugin and returns a Promise', () => {
      emailInstance.cordovaEmail.requestPermission = jest.fn();
      const result = emailInstance.request();
      expect(result instanceof Promise).toBe(true);
      expect(emailInstance.cordovaEmail.requestPermission).toHaveBeenCalled();
    });
  });

  describe('hasConfiguredEmail()', () => {
    it('calls isAvailable on the cordovaEmail plugin and returns a Promise', () => {
      emailInstance.cordovaEmail.isAvailable = jest.fn();
      const result = emailInstance.hasConfiguredEmail();
      expect(result instanceof Promise).toBe(true);
      expect(emailInstance.cordovaEmail.isAvailable).toHaveBeenCalled();
    });
  });
});
