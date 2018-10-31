import { shallowMount } from '@vue/test-utils';
import Authed from '@/layouts/Authed.vue';
import Header from '@/components/Wallet/Header.vue';
import MainNav from '@/components/Wallet/MainNav.vue'
import { localVue, i18n, createRouter } from '@/../tests/unit/helpers/setupLocalVue.js';
import { __createMocks as createStoreMocks } from '@/../tests/store/__mocks__/store.js';

describe('Authed.vue', () => {
  let storeMocks;
  let wrapper;
  let store;
  let router;

  function wrapperInit (options) {
    return shallowMount(Authed, options);
  }

  function storeInit (custom) {
    storeMocks = createStoreMocks(custom);
    router = createRouter(storeMocks.store);
    router.push({ path: `/` });
    wrapper = wrapperInit({ i18n, router, localVue, store: storeMocks.store });
    store = wrapper.vm.$store;
  }

  beforeEach(() => storeInit());

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('renders a Header component', () => {
    expect(wrapper.contains(Header)).toBe(true);
  });

  it('renders a router-view component', () => {
    expect(wrapper.contains('router-view-stub')).toBe(true);
  });

  it('renders a MainNav component', () => {
    expect(wrapper.contains(MainNav)).toBe(true);
  });

  it('calls updateMainNavVisibility() on route change', () => {
    const updateMainNavVisibilityMock = jest.fn();
    wrapper.setMethods({updateMainNavVisibility: updateMainNavVisibilityMock});
    router.push({ path: `/fake1` });
    router.push({ path: `/fake2` });
    expect(updateMainNavVisibilityMock).toHaveBeenCalledTimes(2);
  });

  it('calls updateMainNavVisibility() on isSearchingContacts change', () => {
    const updateMainNavVisibilityMock = jest.fn();
    wrapper.setMethods({updateMainNavVisibility: updateMainNavVisibilityMock});
    store.state.search.isSearchingContacts = true;
    expect(updateMainNavVisibilityMock).toHaveBeenCalledTimes(1);
    store.state.search.isSearchingContacts = false;
    expect(updateMainNavVisibilityMock).toHaveBeenCalledTimes(2);
  });

  it('hides MainNav if searching contacts and route is "/wallet/payments"', () => {
    expect(wrapper.find('qlayoutfooter-stub').isVisible()).toBe(true);
    store.state.search.isSearchingContacts = true;
    router.push({ path: `/wallet/payments` });
    expect(wrapper.find('qlayoutfooter-stub').isVisible()).toBe(false);
  });
});
