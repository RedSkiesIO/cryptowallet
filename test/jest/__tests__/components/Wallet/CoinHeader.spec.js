import { mount } from '@vue/test-utils';
import CoinHeader from '@/components/Wallet/CoinHeader';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';
// import Coin from '@/store/wallet/entities/coin';
// import LatestPrice from '@';

describe('WalletItem.vue', () => {
  let storeMocks;
  let wrapper;
  let router;

  const mockGetBalance = jest.fn().mockImplementation(() => {
    return {
      unconfirmed: 0,
      available: 0,
    };
  });

  const propsData = {
    wallet: {
      id: 1,
      name: 'Catalyst',
      displayName: 'Catalyst',
      parentName: 'Ethereum',
      symbol: 'CAT',
      network: 'ETHEREUM_ROPSTEN',
      sdk: 'ERC20',
    },
    clickItemAction: 'addWallet',
  };

  function wrapperInit(options) {
    return mount(CoinHeader, options);
  }

  function storeInit(custom) {
    storeMocks = createStoreMocks(custom);
    router = createRouter(storeMocks.store);
    router.push({ path: '/' });
    wrapper = wrapperInit({
      i18n,
      router,
      localVue,
      store: storeMocks.store,
      propsData,
      mocks: { getBalance: mockGetBalance },
    });
  }

  beforeEach(() => { return storeInit(); });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });
});
