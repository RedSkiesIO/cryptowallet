import { shallowMount } from '@vue/test-utils';
import WalletsList from '@/components/Wallet/WalletsList';
import WalletItem from '@/components/Wallet/WalletItem';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';

describe('WalletsList.vue', () => {
  let storeMocks;
  let wrapper;
  let store;

  const propsData = {
    wallets: {
      BTC: {
        key: 'BTC',
        name: 'Bitcoin',
        balance: 25.532344,
        uid: 1,
      },
      ATL: {
        key: 'ATL',
        name: 'Atlas',
        balance: 21.532344,
        uid: 2,
      },
      ETH: {
        key: 'ETH',
        name: 'Ethereum',
        balance: 55.532344,
        uid: 3,
      },
    },
    currency: {},
    wallets: {},
  };

  function wrapperInit (options) {
    return shallowMount(WalletsList, options);
  }

  function storeInit (custom) {
    storeMocks = createStoreMocks(custom);
    wrapper = wrapperInit({ propsData, localVue, i18n, store: storeMocks.store });
    store = wrapper.vm.$store;
  }

  beforeEach(() => storeInit());

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('renders a section element with .scroll-area class', () => {
    expect(wrapper.contains('section.scroll-area')).toBe(true);
  });

  it('renders a correct number of WalletItem components', () => {
    expect(wrapper.findAll(WalletItem).length === Object.keys(propsData.wallets).length).toBe(true);
  });
});
