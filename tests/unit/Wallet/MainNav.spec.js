import { createLocalVue, mount } from '@vue/test-utils';
import MainNav from '@/components/Wallet/MainNav.vue';
import { __createMocks as createStoreMocks } from '@/../tests/store/__mocks__/store.js';
import { localVue, router } from '../setupLocalVue';

const menuItems = ['Balance', 'Analytics', 'Payments', 'Exchange', 'More'];

describe('MainNav.vue', () => {
  let storeMocks;
  let wrapper;
  let store;

  function wrapperInit (options) {
    return mount(MainNav, options);
  }

  function storeInit (custom) {
    storeMocks = createStoreMocks(custom);
    wrapper = wrapperInit({ router, localVue, store: storeMocks.store, });
    store = wrapper.vm.$store;
  }

  beforeEach(() => storeInit());

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('renders a section with .main-nav class', () => {
    expect(wrapper.contains('section.main-nav')).toBe(true);
  });

  it('renders all of the menu items', () => {
    expect(wrapper.findAll('a.main-nav-link').length).toBe(5);
    menuItems.forEach((item, index) => {
      expect(wrapper.findAll('a').at(index).text()).toBe(menuItems[index]);
    });
  });

  it('updates the path on each menu item click', () => {
    wrapper.findAll('a').at(0).trigger('click');
    expect(wrapper.vm.$route.path).toBe('/wallet/balance');
    wrapper.findAll('a').at(1).trigger('click');
    expect(wrapper.vm.$route.path).toBe('/wallet/analytics');
    wrapper.findAll('a').at(2).trigger('click');
    expect(wrapper.vm.$route.path).toBe('/wallet/payments');
    wrapper.findAll('a').at(3).trigger('click');
    expect(wrapper.vm.$route.path).toBe('/wallet/exchange');
    wrapper.findAll('a').at(4).trigger('click');
    expect(wrapper.vm.$route.path).toBe('/wallet/more');
  });

  it('renders a correct icon on each menu item', () => {
    expect(wrapper.findAll('a').at(0).contains('.fa-wallet')).toBe(true);
    expect(wrapper.findAll('a').at(1).contains('.fa-chart-bar')).toBe(true);
    expect(wrapper.findAll('a').at(2).contains('.fa-exchange-alt')).toBe(true);
    expect(wrapper.findAll('a').at(3).contains('.fa-sync')).toBe(true);
    expect(wrapper.findAll('a').at(4).contains('.fa-ellipsis-h')).toBe(true);
  });
});
