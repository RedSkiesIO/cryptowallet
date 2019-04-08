/* eslint-disable no-magic-numbers */
import BackEndService from '@/boot/BackEndService/';
import { shallowMount } from '@vue/test-utils';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';
import Account from '@/store/wallet/entities/account';

const accountData = JSON.parse('{"$id":1,"id":1,"uid":"b2d1d4a8-59ed-f8a1-6476-30255f71618e","refresh_token":"U2FsdGVkX1/J7bIecIeyIFBThzJ9IE8DnqJsf92AqgjcmsVeC23aE6hj9zB1U/7oAqcyoV7+chYPOSP8yWEuRE1xCMdaKsY4bMEwsWhFIGQ9VxlHF3a0TJ/OC4zszCONeJ7lV9NJeXZAkRmtLKJgCM4uSPjqlIPehigFVx8xjkDSXyIeODBWXQV/cREYMN/YtQVLFQtOGUGD0PfoVVNKscEG8mHKBlzroggJgWH+sjQjeFnFUsy48sy7Kc9DFs+8eUFvUpAqnXIXK6sIREv2/Q==","salt":"$2a$10$h7F3s0YLfsMzEKdmOIMMl.","pinHash":"$2a$10$h7F3s0YLfsMzEKdmOIMMl.QVtO2TKFA1Tj9H8Tsrz0AqH9Tr3cPBC","name":"asd","locale":"en-gb","currency":"","node":null,"default":true,"seed":["release","thunder","stuff","feature","grant","super","sing","exit","profit","document","busy","allow"],"wallets":[]}');
const pin = [0, 0, 0, 0, 0, 0];

describe('boot/BackEndService', () => {
  let errorHandler;
  let wrapperMock;
  let router;
  let store;
  let storeMocks;
  let backEndService;

  const defaultProps = {};

  function wrapperInit(options) {
    return shallowMount({ name: 'mock', template: '<div/>' }, options);
  }

  function storeInit(custom, propsData, parentComponent = null) {
    errorHandler = jest.fn();
    storeMocks = createStoreMocks(custom);
    Account.insert({ data: accountData });
    BackEndService({ Vue: localVue });

    router = createRouter(storeMocks.store);
    router.push({ path: '/setup/0' });
    wrapperMock = wrapperInit({
      i18n,
      router,
      localVue,
      propsData,
      store: storeMocks.store,
      mocks: {
        errorHandler,
      },
    });
    store = wrapperMock.vm.$store;

    backEndService = new wrapperMock.vm.$root.BackEndService(wrapperMock.vm, accountData.id, pin.join(''));
  }

  beforeEach(() => { storeInit({}, defaultProps); });

  it('exports a function', async () => {
    expect(typeof BackEndService).toBe('function');
  });

  it('sets refresh token correctly when initialised ', () => {
    expect(backEndService.refreshToken).toBe(accountData.refresh_token);
  });

  describe('connect() method', () => {
    it('uses a refresh token if available', async (done) => {
      backEndService.refreshAuth = jest.fn().mockReturnValue(201);
      const result = await backEndService.connect();
      expect(result).toBe(true);
      done();
    });

    it('tries to re-authenticate if refresh token invalid', async (done) => {
      backEndService.refreshAuth = jest.fn().mockImplementation(() => {
        throw new Error();
      });
      backEndService.auth = jest.fn().mockReturnValue(200);
      const result = await backEndService.connect();
      expect(backEndService.refreshAuth).toHaveBeenCalled();
      expect(backEndService.auth).toHaveBeenCalled();
      expect(result).toBe(true);
      done();
    });

    it('tries to re-authenticate if no refreshToken available', async (done) => {
      backEndService.auth = jest.fn().mockReturnValue(200);
      backEndService.refreshToken = null;
      const result = await backEndService.connect();
      expect(backEndService.auth).toHaveBeenCalled();
      expect(result).toBe(true);
      done();
    });

    it('tries to establish connection x number of times based on the config', async (done) => {
      backEndService.auth = jest.fn().mockImplementation(() => {
        throw new Error();
      });

      backEndService.refreshAuth = jest.fn().mockImplementation(() => {
        throw new Error();
      });

      const createMock = jest.fn();
      wrapperMock.vm.$toast.create = createMock;

      backEndService.refreshToken = null;
      backEndService.maxConnectAttempts = 3;
      backEndService.longDelay = 50;
      backEndService.connect();

      setTimeout(() => {
        expect(createMock).toHaveBeenCalledWith(10, wrapperMock.vm.$t('failedToConnect'), 500);
        expect(createMock).toHaveBeenCalledTimes(3);
        done();
      }, 500);
    });
  });

  describe('auth() method', () => {
    it('calls the auth endpoint and returns the status code', () => {

    });

    it('stores access and refresh tokens if aplicable', () => {

    });
  });

  describe('refreshAuth() method', () => {
    it('calls the refresh token endpoint with correct data and returns the status code', () => {

    });

    it('stores access and refresh tokens if aplicable', () => {

    });
  });

  describe('try() method', () => {
    it('makes a call to the URL and returns the response', () => {

    });

    it('makes multiple attempts if the request fails', () => {

    });

    it('updates the refresh token on the successful response', () => {

    });
  });


});

































