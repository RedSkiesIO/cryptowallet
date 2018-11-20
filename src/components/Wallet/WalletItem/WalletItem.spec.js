import { shallowMount } from '@vue/test-utils';
import WalletItem from '@/components/Wallet/WalletItem';
import Amount from '@/components/Wallet/Amount';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';

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
    currency: {},
    wallet: {
      balance: 10,
    },
  };

  const walletObjProp = {
    wallet: {
      uid: 1
    }
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

  it('calls selectWalletMock() method on click correctly', () => {
    const selectWalletMock = jest.fn();
    wrapper.setMethods({selectWallet: selectWalletMock});
    wrapper.setProps(walletObjProp);
    wrapper.find('.selectWallet').trigger('click');
    expect(selectWalletMock).toHaveBeenCalledWith(1);
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
    wrapper.setProps(walletObjProp);
    wrapper.find('.selectWallet').trigger('click');
    expect(store.state.route.path).toBe(`/wallet/balance/${propsData.data.uid}`);
  });
});
