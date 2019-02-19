import { mount } from '@vue/test-utils';
import Header from '@/layouts/Header';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';

describe('Header.vue', () => {
  let storeMocks;
  let wrapper;
  let store;
  let router;

  function wrapperInit (options) {
    return mount(Header, options);
  }

  function storeInit (custom) {
    storeMocks = createStoreMocks(custom);
    router = createRouter(storeMocks.store);
    router.push({ path: `/` });
    wrapper = wrapperInit({ i18n, router, localVue, store: storeMocks.store, });
    store = wrapper.vm.$store;
  }

  beforeEach(() => storeInit());

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('it renders a section with .header-section class', () => {
    expect(wrapper.contains('section.header-section')).toBe(true);
  });

  it('renders a h1 element with .header-h1 class and the wallet name within it', () => {
    expect(wrapper.contains('h1.header-h1')).toBe(true);
    expect(wrapper.find('h1.header-h1').html().includes('CryptoWallet')).toBe(true);
  });

  it('renders a "Go Back" button', () => {
    expect(wrapper.find('button').text()).toBe('Go Back');
  });

  it('calls a goBack method on the "Go Back" button click', () => {
    const goBackMock = jest.fn();
    wrapper.setMethods({goBack: goBackMock})
    router.push({ path: `/fake/` });
    wrapper.find('button').trigger('click');
    expect(goBackMock).toBeCalledTimes(1);
  });

  it('switches the "Go Back" button disabled state based on the window.history length', () => {
    expect(wrapper.contains('button.disabled')).toBe(true);
    router.push({ path: `/fake/` });
    expect(wrapper.contains('button.disabled')).toBe(false);
  });
});
