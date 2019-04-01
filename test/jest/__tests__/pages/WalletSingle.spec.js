import WalletSingle from '@/pages/WalletSingle';
import { shallowMount } from '@vue/test-utils';
import { localVue } from '@/helpers/SetupLocalVue';
// import RefreshWallet from '@/helpers';
import Vuex from 'vuex';

jest.mock('@helpers/RefreshWallet', () => {
  return {
    refreshWallet: jest.fn(),
  };
});

describe('WalletSingle.vue', () => {
  let store;
  let getters;
  let wrapper;
  let backEndService;
  let errorHandler;
  let coinSDKS;

  beforeEach(() => {
    coinSDKS = {
      Bitcoin: jest.fn(),
    };
    errorHandler = jest.fn();
    backEndService = {
      connect: jest.fn(),
      loadPriceFeed: jest.fn(),
    };
    // refreshWallet = jest.fn();
    getters = {
      'entities/wallet/find': () => { return () => { return { sdk: 'Bitcoin' }; }; },
    };
    store = new Vuex.Store({
      state: {
        route: { params: { id: 1 } },
        settings: {
          authenticatedAccount: 1,
          delay: {
            normal: 500,
          },
        },
      },
      getters,
    });
    wrapper = shallowMount(WalletSingle, {
      localVue,
      store,
      mocks: {
        backEndService,
        errorHandler,
        coinSDKS,
      },
    });
  });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('calls the refreshWallet plugin on a updateWalletSingle event', (done) => {
    wrapper.vm.$nextTick(() => {
      wrapper.vm.$root.$emit('updateWalletSingle');
      done();
    });
  });
});
