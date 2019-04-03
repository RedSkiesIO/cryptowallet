/* eslint-disable no-magic-numbers */
import { shallowMount } from '@vue/test-utils';
import TransactionsList from '@/components/Wallet/TransactionsList';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';
import {
  mockBitcoinTxs, mockBitcoinTxsSorted, mockEthereumTxs, mockEthereumTxsSorted,
} from '@/store/wallet/__mocks__/tx.js';
import Tx from '@/store/wallet/entities/tx';

describe('TransactionsList.vue', () => {
  let storeMocks;
  let wrapper;
  // let store;
  let router;

  const propsData = {
    filter: 'all',
    wallet: {
      id: 4,
      account_id: 1,
      displayName: 'Bitcoin',
      sdk: 'Bitcoin',
    },
  };

  function wrapperInit(options, empty) {
    if (!empty) {
      Tx.insert({ data: mockBitcoinTxs.data });
    }
    return shallowMount(TransactionsList, options);
  }

  function storeInit(empty = false) {
    storeMocks = createStoreMocks();
    router = createRouter(storeMocks.store);
    router.push({ path: '/' });
    wrapper = wrapperInit({
      i18n, router, localVue, store: storeMocks.store, propsData,
    }, empty);
    // store = wrapper.vm.$store;
  }

  beforeEach(() => { return storeInit(); });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('renders a section with .scroll-area class', () => {
    expect(wrapper.contains('section.scroll-area')).toBe(true);
  });

  it('computes Bitcoin transactions correctly', () => {
    expect(wrapper.vm.transactions).toEqual(mockBitcoinTxsSorted.data);
  });

  it('computes Ethereum transactions correctly', () => {
    Tx.insert({ data: mockEthereumTxs.data });
    wrapper.setProps({
      filter: 'all',
      wallet: {
        id: 5,
        account_id: 1,
        displayName: 'Ethereum',
        sdk: 'Ethereum',
      },
    });
    expect(wrapper.vm.transactions).toEqual(mockEthereumTxsSorted.data);
  });

  it('displays a q-banner if there are no transactions', () => {
    storeInit(true);
    expect(wrapper.contains('q-banner-stub')).toBe(true);
    expect(wrapper.text()).toBe('Transaction history is empty.');
  });

  it('computes filtered correctly', () => {
    expect(wrapper.vm.filtered.length).toBe(22);

    wrapper.setProps({ filter: 'sent' });
    expect(wrapper.vm.filtered.length).toBe(12);
    wrapper.vm.filtered.forEach((tx) => {
      expect(tx.sent).toBeTruthy();
    });

    wrapper.setProps({ filter: 'received' });
    expect(wrapper.vm.filtered.length).toBe(10);
    wrapper.vm.filtered.forEach((tx) => {
      expect(tx.sent).toBeFalsy();
    });
  });

  it('computes filteredPaginated correctly', () => {
    expect(wrapper.vm.filteredPaginated.length).toBe(10);

    wrapper.setData({
      page: 2,
      perPage: 10,
    });
    expect(wrapper.vm.filteredPaginated.length).toBe(20);

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

  it('calls the touchStart() method on touchstart event', () => {
    wrapper.find('section.scroll-area').trigger('touchstart', { touches: [{ clientY: 399 }] });
    expect(wrapper.vm.touchStartY).toBe(399);
  });

  it('calls the touchMove() method on touchMove event', () => {
    const mockStopPropagation = jest.fn();
    wrapper.vm.$refs.scrollArea.$el.childNodes[0].scrollTop = 0;
    wrapper.find('section.scroll-area').trigger('touchstart', { touches: [{ clientY: 399 }] });
    wrapper.find('section.scroll-area').trigger('touchmove', { touches: [{ clientY: 400 }] });
    expect(wrapper.vm.touchStartY).toBe(399);
    wrapper.vm.$refs.scrollArea.$el.childNodes[0].scrollTop = 10;
    wrapper.find('section.scroll-area').trigger('touchstart', { touches: [{ clientY: 399 }] });
    wrapper.find('section.scroll-area').trigger('touchmove', { stopPropagation: mockStopPropagation, touches: [{ clientY: 399 }] });
    expect(mockStopPropagation).toHaveBeenCalledTimes(2);
  });

  //   it('calls event.stopPropagation() correctly within prevent() method', () => {
  //     const event = { stopPropagation: jest.fn() };
  //     wrapper.vm.$refs.scrollArea.$el.childNodes[0].scrollTop = 0;
  //     wrapper.vm.prevent(event);
  //     expect(event.stopPropagation).toHaveBeenCalledTimes(0);

//     wrapper.vm.$refs.scrollArea.$el.childNodes[0].scrollTop = 10;
//     wrapper.vm.prevent(event);
//     expect(event.stopPropagation).toHaveBeenCalledTimes(1);
//   });
});
