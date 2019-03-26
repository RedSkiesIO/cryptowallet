/* eslint-disable no-magic-numbers */
import { shallowMount } from '@vue/test-utils';
import Complete from '@/pages/Setup/Steps/Complete';
import { localVue } from '@/helpers/SetupLocalVue';
import Vuex from 'vuex';
// import { Quasar, uid } from 'quasar';
// import Account from '@/store/wallet/entities/account';
// import Wallet from '@/store/wallet/entities/wallet';
import supportedCoins from '@/store/settings/state/supportedCoins.js';

describe('Complete.vue', () => {
  let store;
  let actions;
  let wrapper;
  let accountInitializer;
  let BackEndService;
  let backEndService;
  let $router;
  let errorHandler;

  beforeEach(() => {
    errorHandler = jest.fn();
    $router = {
      push: jest.fn(() => { '/wallet'; }),
    };
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
    actions = {
      'settings/setLoading': jest.fn(),
      'settings/setSelectedAccount': jest.fn(),
      'settings/setAuthenticatedAccount': jest.fn(),
      'settings/setLayout': jest.fn(),
      'setup/clearSetupData': jest.fn(),
    };
    store = new Vuex.Store({
      state: {
        settings: {
          supportedCoins,
          delay: 500,
        },
        setup: {
          accountName: 'Stephen',
          pinArray: [0, 0, 0, 0, 0, 0],
          pinConfirmArray: [0, 0, 0, 0, 0, 0],
          salt: '$2a$10$KE86k38NXlqTBgOQUC9bE.',
          node: null,
        },
      },
      actions,
    });
    wrapper = shallowMount(Complete, {
      localVue,
      store,
      mocks: {
        accountInitializer,
        BackEndService,
        backEndService,
        $router,
        errorHandler,
      },
    });
  });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('displays a loading modal', () => {
    expect(actions['settings/setLoading']).toHaveBeenCalled();
  });

  it('creates an account and adds it to the database', (done) => {
    wrapper.vm.$nextTick(() => {
      setTimeout(() => {
        expect(accountInitializer.createAccount).toHaveBeenCalled();
        expect(actions['settings/setSelectedAccount']).toHaveBeenCalled();
        done();
      }, 501);
    });
  });

  it('calls accountInitializer to generate the wallets', (done) => {
    wrapper.vm.$nextTick(() => {
      setTimeout(() => {
        expect(accountInitializer.createWallets).toHaveBeenCalled();
        expect(accountInitializer.createERC20Wallets).toHaveBeenCalled();
        done();
      }, 501);
    });
  });

  it('initialises the back end service and fetches the price feed', (done) => {
    wrapper.vm.$nextTick(() => {
      setTimeout(() => {
        expect(backEndService.connect).toHaveBeenCalled();
        expect(backEndService.loadPriceFeed).toHaveBeenCalled();
        done();
      }, 501);
    });
  });

  it('clears the setup data and loads the wallet screen', (done) => {
    wrapper.vm.$nextTick(() => {
      setTimeout(() => {
        expect(actions['setup/clearSetupData']).toHaveBeenCalled();
        expect($router.push).toHaveBeenCalledWith({ path: '/wallet' });
        done();
      }, 501);
    });
  });

  it('handles errors', (done) => {
    wrapper.vm.$nextTick(() => {
      accountInitializer.createAccount = null;
      setTimeout(() => {
        expect(wrapper.vm.errorHandler).toHaveBeenCalled();
        done();
      }, 501);
    });
  });
});
