import WalletSingle from '@/pages/WalletSingle';
import { shallowMount } from '@vue/test-utils';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';

jest.mock('@/workers/RefreshWallet');

describe('WalletSingle.vue', () => {
  let wrapper;
  let storeMocks;
  let router;

  const delay = 501;
  const coinSDKS = {
    Bitcoin: jest.fn(),
  };
  const backEndService = {
    connect: jest.fn(),
    loadCoinPriceData: jest.fn(),
  };

  const errorHandler = jest.fn();

  const customStore = {
    getters: {
      'entities/wallet/find': () => { return () => { return { sdk: 'Bitcoin' }; }; },
    },
  };

  const propsData = {};

  function wrapperInit(options) {
    return shallowMount(WalletSingle, options);
  }

  function storeInit(custom) {
    storeMocks = createStoreMocks(custom);
    router = createRouter(storeMocks.store);
    router.push({ path: '/wallet/1' });
    wrapper = wrapperInit({
      i18n,
      router,
      localVue,
      propsData,
      store: storeMocks.store,
      mocks: {
        backEndService,
        coinSDKS,
        errorHandler,
      },
    });
  }

  beforeEach(() => {
    storeInit(customStore);
  });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('calls the refreshWallet plugin on a updateWalletSingle event', async (done) => {
    const refreshWallet = jest.fn();
    wrapper.vm.$walletWorker = { refreshWallet };
    const doneMock = jest.fn();
    wrapper.vm.$nextTick(() => {
      wrapper.vm.$root.$emit('updateWalletSingle', doneMock);
      setTimeout(() => {
        expect(backEndService.loadCoinPriceData).toHaveBeenCalled();
        expect(refreshWallet).toHaveBeenCalled();
        done();
      }, delay);
    });
  });

  it('calls the errorHandler', async (done) => {
    const doneMock = jest.fn();
    backEndService.loadCoinPriceData.mockImplementationOnce(() => { throw new Error(); });
    storeInit(customStore);
    wrapper.vm.$nextTick(() => {
      wrapper.vm.$root.$emit('updateWalletSingle', doneMock);
      expect(backEndService.loadCoinPriceData).toHaveBeenCalled();
      expect(wrapper.vm.errorHandler).toHaveBeenCalled();
      done();
    });
  });
});
