import WalletList from '@/components/Wallet/WalletsList';
import { shallowMount } from '@vue/test-utils';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';
import SupportedCoins from '@/store/settings/state/supportedCoins.js';
import Coin from '@/store/wallet/entities/coin';

describe('WalletsList.vue', () => {
  let storeMocks;
  let wrapper;
  let router;

  function wrapperInit(options) {
    return shallowMount(WalletList, options);
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

  it('renders the wallet items', () => {
    SupportedCoins.forEach((coin) => {
      Coin.insert({ data: coin });
    });
    const numOfWallets = SupportedCoins.length;
    const items = wrapper.findAll('walletitem-stub');
    expect(items.length).toBe(numOfWallets);
  });
});
