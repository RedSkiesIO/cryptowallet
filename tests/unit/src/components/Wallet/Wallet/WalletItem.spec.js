import { shallowMount } from '@vue/test-utils';
import WalletItem from '@/components/Wallet/Wallet/WalletItem.vue';
import Amount from '@/components/Wallet/SharedComponents/Amount.vue';
import { localVue, i18n, createRouter } from '@/../tests/unit/helpers/setupLocalVue.js';
import { __createMocks as createStoreMocks } from '@/../tests/store/__mocks__/store.js';

describe('WalletItem.vue', () => {
  let storeMocks;
  let wrapper;
  let store;
  let router;

  const propsData = {
    data: {
      key: 'BTC',
      name: 'Bitcoin',
      balance: 25.532344,
      uid: 1,
    },
    currency: 'GPB',
  };

  function wrapperInit (options) {
    return shallowMount(WalletItem, options);
  }

  function storeInit (custom) {
    storeMocks = createStoreMocks(custom);
    router = createRouter(storeMocks.store);
    router.push({ path: `/` });
    wrapper = wrapperInit({ i18n, router, localVue, store: storeMocks.store, propsData });
    store = wrapper.vm.$store;
  }

  beforeEach(() => storeInit());

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('calls selectCoin() method on click correctly', () => {
    const selectCoinMock = jest.fn();
    wrapper.setMethods({selectCoin: selectCoinMock});
    wrapper.find('.coin').trigger('click');
    expect(selectCoinMock).toHaveBeenLastCalledWith(propsData.data.uid);
  });

  it('renders the coin name', () => {
    expect(wrapper.html().includes(propsData.data.name));
  });

  it('renders the balance', () => {
    expect(wrapper.html().includes(propsData.data.balance));
  });

  it('renders the Amount component', () => {
    expect(wrapper.contains(Amount)).toBe(true);
  });

  it('renders the icon components correctly', () => {
    expect(wrapper.contains('qicon-stub[name="chevron_right"]')).toBe(true);
  });

  it('navigates to correct route when clicked on', () => {
    expect(store.state.route.path).toBe('/');
    wrapper.find('.coin').trigger('click');
    expect(store.state.route.path).toBe(`/wallet/balance/${propsData.data.uid}`);
  });


});
