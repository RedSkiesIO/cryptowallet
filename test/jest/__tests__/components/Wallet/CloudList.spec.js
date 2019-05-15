/* eslint-disable no-magic-numbers */
import CloudList from '@/components/Wallet/CloudList';
import { mount, createWrapper } from '@vue/test-utils';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';
import Wallet from '@/store/wallet/entities/wallet';

describe('CloudListItem.vue', () => {
  let storeMocks;
  let wrapper;
  let router;

  const mockWallets = {
    data: [{
      id: 1,
      account_id: 1,
      name: 'Catalyst',
      displayName: 'Catalyst',
      parentName: 'Ethereum',
      symbol: 'CAT',
      network: 'ETHEREUM_ROPSTEN',
      sdk: 'ERC20',
      enabled: false,
      imported: true,
    },
    {
      id: 2,
      account_id: 1,
      name: 'Bitcoin',
      displayName: 'Bitcoin',
      symbol: 'BTC',
      network: 'BITCOIN',
      sdk: 'Bitcoin',
      enabled: true,
      imported: true,
    },
    {
      id: 5,
      account_id: 1,
      name: 'Ethereum',
      displayName: 'Ethereum',
      sdk: 'Ethereum',
      symbol: 'ETH',
      enabled: true,
      imported: true,
    },
    ],
  };

  function wrapperInit(options) {
    return mount(CloudList, options);
  }

  function storeInit(custom) {
    storeMocks = createStoreMocks(custom);
    router = createRouter(storeMocks.store);
    router.push({ path: '/wallet' });
    wrapper = wrapperInit({
      i18n,
      router,
      localVue,
      store: storeMocks.store,
      stubs: { CloudListItem: true },
    });
  }

  it('renders and matches snapshot', () => {
    storeInit();
    expect(wrapper.element).toMatchSnapshot();
  });

  it('displays an add wallet button if no wallets are enabled', () => {
    storeInit();
    expect(wrapper.find('button').text()).toMatch('add_circle_outline');
  });

  it('calls setAddWalletModalOpened action on add walet button click', (done) => {
    storeInit();
    wrapper.find('button').trigger('click');
    setTimeout(() => {
      expect(storeMocks.actions.setAddWalletModalOpened.mock.calls[0][1]).toEqual(true);
      done();
    }, 0);
  });

  it('displays a cloud list item for each enabled wallet', (done) => {
    storeInit();
    Wallet.$insert(mockWallets);
    setTimeout(() => {
      wrapper.vm.$options.activated[0]();
      expect(wrapper.findAll('cloudlistitem-stub').length).toEqual(3);
      done();
    }, 0);
  });

  it('calls the touchStart() method on touchstart event', () => {
    storeInit();
    wrapper.find('.scroll-start').trigger('touchstart', { touches: [{ clientY: 399 }] });
    expect(wrapper.vm.touchStartY).toBe(399);
  });

  it('calls the touchMove() method on touchMove event', () => {
    storeInit();
    Wallet.$insert(mockWallets);
    const mockStopPropagation = jest.fn();
    wrapper.find('.scroll-start').trigger('touchstart', { touches: [{ clientY: 399 }] });
    wrapper.find('.scroll-start').trigger('touchmove', { touches: [{ clientY: 400 }] });
    expect(wrapper.vm.touchStartY).toBe(399);
    wrapper.vm.$refs.scrollArea.$el.childNodes[0].scrollTop = 10;
    wrapper.find('.scroll-start').trigger('touchstart', { touches: [{ clientY: 399 }] });
    wrapper.find('.scroll-start').trigger('touchmove', { stopPropagation: mockStopPropagation, touches: [{ clientY: 399 }] });
    expect(mockStopPropagation).toHaveBeenCalledTimes(2);
  });

  it('fires an event to hide and show the balance when the user scrolls', (done) => {
    storeInit();
    const rootWrapper = createWrapper(wrapper.vm.$root);
    Wallet.$insert(mockWallets);
    wrapper.vm.scrolled({ position: 101, direction: 'down' });
    setTimeout(() => {
      expect(rootWrapper.emitted('isHomeBalanceVisible')[0]).toEqual([false]);
      done();
    }, 0);
    wrapper.vm.scrolled({ position: 99, direction: 'up' });
    setTimeout(() => {
      expect(rootWrapper.emitted('isHomeBalanceVisible')[1]).toEqual([true]);

      done();
    }, 0);
  });

  it('activated lifecycle hook resets scroll position', (done) => {
    const mockQuerySelector = jest.fn().mockImplementation(() => {
      return [{ scrollTop: 10 }];
    });
    Object.defineProperty(global.document, 'querySelectorAll', {
      value: mockQuerySelector,
    });
    storeInit();
    wrapper.vm.$options.activated[0]();
    setTimeout(() => {
      expect(mockQuerySelector).toHaveBeenCalledTimes(2);
      done();
    }, 0);
  });
});
