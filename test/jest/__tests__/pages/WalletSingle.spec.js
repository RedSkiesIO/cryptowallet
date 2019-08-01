/* eslint-disable no-magic-numbers */
import WalletSingle from '@/pages/WalletSingle';
import { shallowMount } from '@vue/test-utils';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';

jest.mock('@/workers/RefreshWallet');

describe('WalletSingle.vue', () => {
  let wrapper;
  let storeMocks;
  let router;
  let setOnline = true;

  const delay = 501;
  const coinSDKS = {
    Bitcoin: jest.fn(),
  };
  const backEndService = {
    connect: jest.fn(),
    loadCoinPriceData: jest.fn(),
  };

  const errorHandler = jest.fn();

  const mocks = {
    backEndService,
    coinSDKS,
    errorHandler,
  };

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
      mocks,
    });
  }

  beforeEach(() => {
    Object.defineProperty(window.navigator, 'onLine', { value: setOnline, configurable: true });

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
        setOnline = false;
        done();
      }, delay);
    });
  });

  it('does nothing if device is offline', async (done) => {
    jest.clearAllMocks();
    const refreshWallet = jest.fn();
    wrapper.vm.$walletWorker = { refreshWallet };
    const doneMock = jest.fn();
    wrapper.vm.$nextTick(() => {
      wrapper.vm.$root.$emit('updateWalletSingle', doneMock);
      setTimeout(() => {
        expect(refreshWallet).toHaveBeenCalledTimes(0);
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

  it('checks for new txs periodically', (done) => {
    let now = 0;
    Date.now = jest.spyOn(Date, 'now').mockImplementation(() => {
      now += 300000;
      return now;
    });
    const module = {
      refresher: jest.fn().mockReturnValue({}),
      timeout: 300000,
      delay: { short: 200 },
    };
    jest.useFakeTimers();

    storeInit({});
    const bind = wrapper.vm.$options.activated[0].bind(module);
    bind();
    jest.advanceTimersByTime(15000);

    expect(module.refresher).toHaveBeenCalledTimes(3);
    done();
  });

  it('stops the worker when component is deactivated', (done) => {
    wrapper.vm.$options.deactivated[0]();
    expect(wrapper.vm.worker).toBeFalsy();
    done();
  });
});
