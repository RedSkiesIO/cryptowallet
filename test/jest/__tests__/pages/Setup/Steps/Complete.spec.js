import { shallowMount } from '@vue/test-utils';
import Complete from '@/pages/Setup/Steps/Complete';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';


describe('Complete.vue', () => {
  let store;
  let wrapper;
  let accountInitializer;
  let BackEndService;
  let backEndService;
  let errorHandler;
  let storeMocks;
  let router;
  const delay = 501;
  const propsData = {};

  function wrapperInit(options) {
    return shallowMount(Complete, options);
  }

  function storeInit(custom) {
    errorHandler = jest.fn();
    backEndService = {
      connect: jest.fn(),
      loadPriceFeed: jest.fn(),
    };
    BackEndService = jest.fn().mockImplementation(() => {
      return {
        connect: jest.fn(),
        loadPriceFeed: jest.fn(),
      };
    });
    accountInitializer = {
      createAccount: jest.fn(() => { return { id: 5 }; }),
      createWallets: jest.fn(),
      createERC20Wallets: jest.fn(),
    };
    storeMocks = createStoreMocks(custom);
    router = createRouter(storeMocks.store);
    router.push({ path: '/setup/7' });
    wrapper = wrapperInit({
      i18n,
      router,
      localVue,
      propsData,
      store: storeMocks.store,
      mocks: {
        accountInitializer,
        BackEndService,
        backEndService,
        errorHandler,
      },
    });
    store = wrapper.vm.$store;
  }

  beforeEach(() => { storeInit(); });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('displays a loading modal', () => {
    expect(storeMocks.actions.setLoading).toHaveBeenCalled();
  });

  it('creates an account and adds it to the database', (done) => {
    wrapper.vm.$nextTick(() => {
      setTimeout(() => {
        expect(accountInitializer.createAccount).toHaveBeenCalled();
        expect(storeMocks.actions.setAuthenticatedAccount).toHaveBeenCalled();
        done();
      }, delay);
    });
  });

  it('calls accountInitializer to generate the wallets', (done) => {
    wrapper.vm.$nextTick(() => {
      setTimeout(() => {
        expect(accountInitializer.createWallets).toHaveBeenCalled();
        expect(accountInitializer.createERC20Wallets).toHaveBeenCalled();
        done();
      }, delay);
    });
  });

  it('initialises the back end service and fetches the price feed', (done) => {
    wrapper.vm.$nextTick(() => {
      setTimeout(() => {
        expect(backEndService.connect).toHaveBeenCalled();
        expect(backEndService.loadPriceFeed).toHaveBeenCalled();
        done();
      }, delay);
    });
  });

  it('clears the setup data and loads the wallet screen', (done) => {
    wrapper.vm.$nextTick(() => {
      setTimeout(() => {
        expect(storeMocks.actions.clearSetupData).toHaveBeenCalled();
        expect(store.state.route.path).toBe('/wallet');
        done();
      }, delay);
    });
  });

  it('handles errors', (done) => {
    wrapper.vm.$nextTick(() => {
      accountInitializer.createAccount = null;
      setTimeout(() => {
        expect(wrapper.vm.errorHandler).toHaveBeenCalled();
        done();
      }, delay);
    });
  });
});
