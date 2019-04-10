/* eslint-disable no-magic-numbers */
import CWCrypto from '@/boot/CWCrypto/';
import { shallowMount } from '@vue/test-utils';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';

describe('boot/CWCrypto', () => {
  let errorHandler;
  let wrapperMock;
  let router;
  let storeMocks;

  const defaultProps = {};

  function wrapperInit(options) {
    return shallowMount({ name: 'mock', template: '<div/>' }, options);
  }

  function storeInit(custom, propsData) {
    errorHandler = jest.fn();
    storeMocks = createStoreMocks(custom);
    CWCrypto({ Vue: localVue });

    router = createRouter(storeMocks.store);
    router.push({ path: '/' });
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
  }

  beforeEach(() => { storeInit({}, defaultProps); });

  it('exports a function', () => {
    expect(typeof CWCrypto).toBe('function');
  });

  it('hashes the string', () => {
    const string = 'testTring';
    const salt = wrapperMock.vm.$CWCrypto.getSalt();
    const hashedString = wrapperMock.vm.$CWCrypto.bcryptHashString(string, salt);
    expect(typeof hashedString).toBe('string');
  });

  it('compares the string', () => {
    const string = 'testTring2';
    const salt = wrapperMock.vm.$CWCrypto.getSalt();
    const hashedString = wrapperMock.vm.$CWCrypto.bcryptHashString(string, salt);

    expect(wrapperMock.vm.$CWCrypto.bcryptCompareString('false', hashedString)).toBe(false);
    expect(wrapperMock.vm.$CWCrypto.bcryptCompareString(string, hashedString)).toBe(true);
  });

  it('returns a salt string', () => {
    const salt = wrapperMock.vm.$CWCrypto.getSalt();
    expect(typeof salt).toBe('string');
  });
});
