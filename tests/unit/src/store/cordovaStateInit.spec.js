import cordovaStateInit from '@/store/cordovaStateInit';
import { __createMocks as createStoreMocks } from '@/../tests/store/__mocks__/store.js';
import { localVue } from '@/../tests/unit/helpers/setupLocalVue.js';
import { JSDOM } from "jsdom";
const dom = new JSDOM();
global.document = dom.window.document;

describe('cordovaStateInit.spec.js', () => {
  let storeMocks;
  let store;

  beforeEach(() => {
    storeMocks = createStoreMocks();
    store = storeMocks.store;
    global.ContactFindOptions = () => {};
    global.navigator = {};
  });

  afterEach(() => {
    delete global.ContactFindOptions;
    delete global.navigator;
  });


  it('exports a function', () => {
    expect(typeof cordovaStateInit).toBe('function');
  });

  it('calls the correct method (find()) on the global navigator object', () => {
    navigator.contacts = {
      find: jest.fn(),
    };

    cordovaStateInit(store, localVue);
    document.dispatchEvent(new Event('deviceready'));
    expect(navigator.contacts.find).toHaveBeenCalled();
  });

  it('passes errors to the Vue.config.errorHandler', () => {
    const errorHandlerMock = jest.fn();
    localVue.config = {
      errorHandler : errorHandlerMock,
    };

    cordovaStateInit(store, localVue);
    document.dispatchEvent(new Event('deviceready'));
    expect(typeof errorHandlerMock.mock.calls[0][0]).toBe('object');
  });

  it('updates the store on success', () => {
    const fakeContactsArray = ['fake', 'contacts', 'array'];
    navigator.contacts = {
      find(undefined, success) {
        success(fakeContactsArray);
      },
    };

    cordovaStateInit(store, localVue);
    document.dispatchEvent(new Event('deviceready'));
    expect(store.state.wallet.contacts).toBe(fakeContactsArray);
  });
})
