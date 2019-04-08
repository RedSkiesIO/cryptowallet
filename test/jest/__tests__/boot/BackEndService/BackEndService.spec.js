/* eslint-disable no-magic-numbers */
import BackEndService from '@/boot/BackEndService/';
import { shallowMount } from '@vue/test-utils';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';
import Account from '@/store/wallet/entities/account';

const accountData = JSON.parse('{"$id":1,"id":1,"uid":"b2d1d4a8-59ed-f8a1-6476-30255f71618e","refresh_token":"U2FsdGVkX1/J7bIecIeyIFBThzJ9IE8DnqJsf92AqgjcmsVeC23aE6hj9zB1U/7oAqcyoV7+chYPOSP8yWEuRE1xCMdaKsY4bMEwsWhFIGQ9VxlHF3a0TJ/OC4zszCONeJ7lV9NJeXZAkRmtLKJgCM4uSPjqlIPehigFVx8xjkDSXyIeODBWXQV/cREYMN/YtQVLFQtOGUGD0PfoVVNKscEG8mHKBlzroggJgWH+sjQjeFnFUsy48sy7Kc9DFs+8eUFvUpAqnXIXK6sIREv2/Q==","salt":"$2a$10$h7F3s0YLfsMzEKdmOIMMl.","pinHash":"$2a$10$h7F3s0YLfsMzEKdmOIMMl.QVtO2TKFA1Tj9H8Tsrz0AqH9Tr3cPBC","name":"asd","locale":"en-gb","currency":"","node":null,"default":true,"seed":["release","thunder","stuff","feature","grant","super","sing","exit","profit","document","busy","allow"],"wallets":[]}');
const pin = [0, 0, 0, 0, 0, 0];

describe('boot/BackEndService', () => {
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
    });
    store = wrapperMock.vm.$store;

    backEndService = new wrapperMock.vm.$root.BackEndService(wrapperMock.vm, accountData.id, pin.join(''));
  }

  beforeEach(() => { storeInit({}, defaultProps); });

  it('exports a function', async () => {
    expect(typeof BackEndService).toBe('function');
  });

  it('tests', () => {
    //console.log(backEndService);
  });
});
