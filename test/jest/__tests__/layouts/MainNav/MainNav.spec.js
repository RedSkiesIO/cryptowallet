import { mount } from '@vue/test-utils';
import MainNav from '@/layouts/MainNav';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';

const menuItems = ['Wallet', 'Settings'];

describe('MainNav.vue', () => {
  let storeMocks;
  let wrapper;
  let router;

  function wrapperInit(options) {
    return mount(MainNav, options);
  }

  function storeInit(custom) {
    router = createRouter();
    storeMocks = createStoreMocks(custom);
    wrapper = wrapperInit({
      i18n, router, localVue, store: storeMocks.store,
    });
  }

  beforeEach(() => { return storeInit(); });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('renders a section with .main-nav class', () => {
    expect(wrapper.contains('section.main-nav')).toBe(true);
  });

  it('renders all of the menu items', () => {
    expect(wrapper.findAll('a.main-nav-link').length).toBe(2);
    menuItems.forEach((item, index) => {
      expect(wrapper.findAll('a').at(index).text()).toMatch(menuItems[index]);
    });
  });

  it('updates the path on each menu item click', () => {
    wrapper.findAll('a').at(0).trigger('click');
    expect(wrapper.vm.$route.path).toBe('/wallet');
    wrapper.findAll('a').at(1).trigger('click');
    expect(wrapper.vm.$route.path).toBe('/settings');
  });
});
