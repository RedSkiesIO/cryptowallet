import { shallowMount } from '@vue/test-utils';
import Transactions from '@/components/Wallet/Transactions';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';

describe('Transactions.vue', () => {
  let storeMocks;
  let wrapper;
  let store;
  let router;

  function wrapperInit (options) {
    return shallowMount(Transactions, options);
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

  it('renders a secion with .recent-transactions class', () => {
    expect(wrapper.contains('section.recent-transactions')).toBe(true);
  });

  it('renders tabs: All, Sent, Received correctly', () => {
    expect(wrapper.findAll('qtab-stub').length).toBe(3);
    expect(wrapper.contains(`qtab-stub[default="true"][name="tab-1"]`)).toBe(true);
    expect(wrapper.contains(`qtab-stub[label="Sent"][name="tab-2"]`)).toBe(true);
    expect(wrapper.contains(`qtab-stub[label="Received"][name="tab-3"]`)).toBe(true);

    expect(wrapper.contains(`qtabpane-stub[name="tab-1"] transactionslist-stub`)).toBe(true);
    expect(wrapper.contains(`qtabpane-stub[name="tab-2"] transactionslist-stub[filter="sent"]`)).toBe(true);
    expect(wrapper.contains(`qtabpane-stub[name="tab-3"] transactionslist-stub[filter="received"]`)).toBe(true);
  });
});
