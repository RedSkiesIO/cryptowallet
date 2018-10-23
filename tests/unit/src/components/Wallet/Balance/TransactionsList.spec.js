import { shallowMount } from '@vue/test-utils';
import TransactionsList from '@/components/Wallet/Balance/TransactionsList.vue';
import { localVue, i18n, createRouter } from '@/../tests/unit/helpers/setupLocalVue.js';
import { __createMocks as createStoreMocks } from '@/../tests/store/__mocks__/store.js';

describe('TransactionsList.vue', () => {
  let storeMocks;
  let wrapper;
  let store;
  let router;

  const propsData = {
    filter: 'all',
  };

  function wrapperInit (options) {
    return shallowMount(TransactionsList, options);
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

  it('renders a section with .scroll-area class', () => {
    expect(wrapper.contains('section.scroll-area')).toBe(true);
  });

  it('calls the prevent() method on touchmove event', () => {
    const preventMock = jest.fn();
    wrapper.setMethods({prevent: preventMock});
    wrapper.find('section.scroll-area').trigger('touchmove');
    expect(preventMock).toHaveBeenCalled();
  });

  it('renders the tree of elements correctly', () => {
    expect(wrapper.contains(`section.scroll-area
                             qscrollarea-stub.scroll-area
                             qinfinitescroll-stub
                             qtimeline-stub
                             singletransaction-stub`)).toBe(true);
  });

  it('computes transactions correctly', () => {
    expect(wrapper.vm.$store.state.payments.transactions === wrapper.vm.transactions).toBe(true);
  });

  it('computes filtered correctly', () => {
    wrapper.setProps({filter: 'all'});
    expect(wrapper.vm.$store.state.payments.transactions.length === wrapper.vm.filtered.length).toBe(true);

    wrapper.setProps({filter: 'sent'});
    expect(wrapper.vm.$store.state.payments.transactions.length > wrapper.vm.filtered.length).toBe(true);
    wrapper.vm.filtered.forEach((tx) => {
      expect(tx.to).toBeTruthy();
      expect(tx.from).toBeFalsy();
    });

    wrapper.setProps({filter: 'received'});
    expect(wrapper.vm.$store.state.payments.transactions.length > wrapper.vm.filtered.length).toBe(true);
    wrapper.vm.filtered.forEach((tx) => {
      expect(tx.from).toBeTruthy();
      expect(tx.to).toBeFalsy();
    });
  });

  it('computes filteredPaginated correctly', () => {
    wrapper.setData({
      page: 1,
      perPage: 5,
    });
    expect(wrapper.vm.filteredPaginated.length).toBe(5);

    wrapper.setData({
      page: 2,
      perPage: 5,
    });
    expect(wrapper.vm.filteredPaginated.length).toBe(10);

    wrapper.setData({
      page: 2,
      perPage: 6,
    });
    expect(wrapper.vm.filteredPaginated.length).toBe(12);
  });

  it('calls done() correctly within loadMore() method', async () => {
    wrapper.setData({
      page: 1,
      perPage: 9999,
    });
    const doneMock = jest.fn();
    wrapper.vm.loadMore(null, doneMock);
    expect(doneMock).toHaveBeenLastCalledWith(true);

    wrapper.setData({
      page: 1,
      perPage: 1,
    });
    await wrapper.vm.loadMore(null, doneMock);
    expect(doneMock).toHaveBeenLastCalledWith(false);
  });

  it('calls event.stopPropagation() correctly within prevent() method', () => {
    const event = { stopPropagation: jest.fn() };
    wrapper.vm.$refs.scrollArea.$el.childNodes[0].scrollTop = 0;
    wrapper.vm.prevent(event);
    expect(event.stopPropagation).toHaveBeenCalledTimes(0);

    wrapper.vm.$refs.scrollArea.$el.childNodes[0].scrollTop = 10;
    wrapper.vm.prevent(event);
    expect(event.stopPropagation).toHaveBeenCalledTimes(1);
  });
});
