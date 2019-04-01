import WalletSingle from '@/pages/WalletSingle';
import { shallowMount } from '@vue/test-utils';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';
import RefreshWallet from '@/helpers/RefreshWallet';

jest.mock('@/helpers/RefreshWallet');

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
    loadPriceFeed: jest.fn(),
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

  beforeEach(() => { storeInit(customStore); });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('calls the refreshWallet plugin on a updateWalletSingle event', async (done) => {
    const doneMock = jest.fn();
    wrapper.vm.$nextTick(() => {
      wrapper.vm.$root.$emit('updateWalletSingle', doneMock);
      setTimeout(() => {
        expect(backEndService.loadPriceFeed).toHaveBeenCalled();
        expect(RefreshWallet).toHaveBeenCalled();
        done();
      }, delay);
    });
  });

  it('calls the errorHandler', async (done) => {
    const doneMock = jest.fn();
    backEndService.loadPriceFeed.mockImplementationOnce(() => { throw new Error(); });
    storeInit(customStore);
    wrapper.vm.$nextTick(() => {
      wrapper.vm.$root.$emit('updateWalletSingle', doneMock);
      expect(backEndService.loadPriceFeed).toHaveBeenCalled();
      expect(wrapper.vm.errorHandler).toHaveBeenCalled();
      done();
    });
  });
});
