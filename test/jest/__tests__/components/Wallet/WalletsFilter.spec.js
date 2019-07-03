/* eslint-disable no-magic-numbers */
import WalletFilter from '@/components/Wallet/WalletsFilter';
import { mount } from '@vue/test-utils';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';
import SupportedCoins from '@/store/settings/state/supportedCoins.js';
import Coin from '@/store/wallet/entities/coin';

describe('WalletsFilter.vue', () => {
  let storeMocks;
  let wrapper;
  let router;

  function wrapperInit(options) {
    return mount(WalletFilter, options);
  }

  function storeInit(custom) {
    storeMocks = createStoreMocks(custom);
    router = createRouter(storeMocks.store);
    router.push({ path: '/wallet/' });
    wrapper = wrapperInit({
      i18n, router, localVue, store: storeMocks.store,
    });
  }
  beforeEach(() => { return storeInit(); });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('filters the wallet list by the search input', (done) => {
    SupportedCoins.forEach((coin) => {
      Coin.insert({ data: coin });
    });
    const mockUpdate = jest.fn().mockImplementation((cb) => {
      cb();
    });
    wrapper.vm.filterFn('b', mockUpdate);
    setTimeout(() => {
      wrapper.find('input').trigger('click');
      expect(wrapper.vm.options.length).toBe(3);
      wrapper.vm.filterFn('btc', mockUpdate);
      setTimeout(() => {
        expect(wrapper.vm.options[0].name).toBe('Bitcoin');
        done();
      }, 500);
    }, 500);
  });
});
