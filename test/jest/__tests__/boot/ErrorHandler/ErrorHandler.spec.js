/* eslint-disable no-console */
import ErrorHandler from '@/boot/ErrorHandler/';
import { shallowMount } from '@vue/test-utils';
import { localVue } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';
import Account from '@/store/wallet/entities/account';
import { Notify } from 'quasar';


describe('boot/ErrorHandler', () => {
  let wrapperMock;
  let storeMocks;

  const mockAccount = {
    id: 1,
    name: 'Stephen',
    locale: 'en-gb',
  };

  const defaultProps = {};

  function wrapperInit(options) {
    return shallowMount({ name: 'mock', template: '<div/>' }, options);
  }

  function storeInit(custom, propsData) {
    storeMocks = createStoreMocks(custom);
    ErrorHandler({ Vue: localVue, store: storeMocks.store });
    localVue.rollbar.configure = jest.fn();
    localVue.rollbar.error = jest.fn();
    wrapperMock = wrapperInit({
      localVue,
      propsData,
      store: storeMocks.store,
    });
  }

  beforeEach(() => { storeInit({}, defaultProps); });

  it('exports a function', () => {
    expect(typeof ErrorHandler).toBe('function');
  });

  it('adds errorHandler to vue prototype', () => {
    expect(wrapperMock.vm.errorHandler).toBeTruthy();
  });

  it('sends error to rollbar when errorHandler is called', () => {
    Account.insert({ data: mockAccount });
    console.error = jest.fn();
    Notify.create = jest.fn();
    wrapperMock.vm.errorHandler(new Error('Some Error'));
    expect(localVue.rollbar.configure).toHaveBeenCalledWith({ payload: { account: { name: 'Stephen' } } });
    expect(localVue.rollbar.error).toHaveBeenCalledWith(Error('Some Error'));
    expect(console.error).toHaveBeenCalled();
  });

  it('no toast is displayed if showToast is false', () => {
    console.error = jest.fn();
    wrapperMock.vm.$toast.create = jest.fn();
    Notify.create = jest.fn();
    expect(Notify.create).toHaveBeenCalledTimes(0);
    expect(console.error).toHaveBeenCalledTimes(0);
  });
});
