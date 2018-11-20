import Vuex from 'vuex';
import UserBalance from '@/components/Wallet/Balance';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';

describe('UserBalance.vue', () => {
  let storeMocks;
  let wrapper;
  let store;

  function wrapperInit (options) {
    return shallowMount(UserBalance, options);
  }

  function storeInit (custom) {
    storeMocks = createStoreMocks(custom);
    wrapper = wrapperInit({ localVue, store: storeMocks.store });
    store = wrapper.vm.$store;
  }

  beforeEach(() => storeInit());

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('renders a section with .user-balance class', () => {
    expect(wrapper.contains('section.user-balance')).toBe(true);
  });

  it('renders a h1 with .balance-h1 class', () => {
    expect(wrapper.contains('h1.balance-h1')).toBe(true);
  });
});
