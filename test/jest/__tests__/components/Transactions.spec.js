import { shallowMount } from '@vue/test-utils';
import Transactions from '@/components/Wallet/Transactions';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';

describe('Transactions.vue', () => {
  let storeMocks;
  let wrapper;
  let router;
  const propsData = {
    wallet: {
      account_id: 1,
      displayName: 'Bitcoin',
      sdk: 'Bitcoin',
    },
  };

  function wrapperInit(options) {
    return shallowMount(Transactions, options);
  }

  function storeInit(custom) {
    storeMocks = createStoreMocks(custom);
    router = createRouter(storeMocks.store);
    router.push({ path: '/' });
    wrapper = wrapperInit({
      i18n, router, localVue, store: storeMocks.store, propsData,
    });
  }

  beforeEach(() => { return storeInit(); });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('renders a secion with .recent-transactions class', () => {
    expect(wrapper.contains('section.recent-transactions')).toBe(true);
  });

  it('renders tabs: All, Sent, Received correctly', () => {
    const numOfTabs = 3;
    expect(wrapper.findAll('q-tab-stub').length).toBe(numOfTabs);
    expect(wrapper.vm.tab).toBe('all');
    expect(wrapper.contains('q-tab-stub[default=""][name="all"]')).toBe(true);
    expect(wrapper.contains('q-tab-stub[label="Sent"][name="sent"]')).toBe(true);
    expect(wrapper.contains('q-tab-stub[label="Received"][name="received"]')).toBe(true);

    expect(wrapper.contains('q-tab-panel-stub[name="all"] transactionslist-stub')).toBe(true);
    expect(wrapper.contains('q-tab-panel-stub[name="sent"] transactionslist-stub[filter="sent"]')).toBe(true);
    expect(wrapper.contains('q-tab-panel-stub[name="received"] transactionslist-stub[filter="received"]')).toBe(true);
  });
});
