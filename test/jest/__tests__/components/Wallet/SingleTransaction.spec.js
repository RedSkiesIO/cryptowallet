import { shallowMount } from '@vue/test-utils';
import SingleTransaction from '@/components/Wallet/SingleTransaction';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';
import Coin from '@/store/wallet/entities/coin';
import Wallet from '@/store/wallet/entities/wallet';
import LatestPrice from '@/store/latestPrice';
import SupportedCoins from '@/store/settings/state/supportedCoins.js';


describe('SingleTransaction.vue', () => {
  let storeMocks;
  let wrapper;
  let router;

  const propsData = {
    data: {
      amount: 4.97,
      receiver: ['1CK6KHY6MHgYvmRQ4PAafKYDrg1ejbH1cE'],
      hash: 'd02995c1faf572c5d9ae966915aa7958c88ed2e47f8f208b68d82d863bf61010',
      sent: true,
      confirmations: 12,
      blockHeight: 245,
      fee: 0.1,
      receivedTime: '1547746030',
      confirmedTime: '1547746030',
    },
  };


  function wrapperInit(options) {
    SupportedCoins.forEach((coin) => {
      Coin.insert({ data: coin });
    });
    Wallet.insert({
      data: [{
        id: 4,
        account_id: 1,
        name: 'Bitcoin',
        displayName: 'Bitcoin',
        sdk: 'Bitcoin',
      },
      {
        id: 5,
        account_id: 1,
        name: 'Ethereum',
        displayName: 'Ethereum',
        sdk: 'Ethereum',
      },
      {
        id: 6,
        account_id: 1,
        name: 'Catalyst',
        displayName: 'Catalyst',
        parentName: 'Ethereum',
        sdk: 'ERC20',
      },
      {
        id: 7,
        account_id: 1,
        name: 'Litecoin',
        displayName: 'Litecoin',
        sdk: 'Bitcoin',
      }],
    });

    LatestPrice.insert({
      data: [{
        coin: 'BTC',
        currency: 'GBP',
        data: {
          CHANGEPCT24HOUR: 4.208515135911541,
          PRICE: 3845.19,
          VOLUME24HOURTO: 10458846.999825574,
        },
      },
      {
        coin: 'ETH',
        currency: 'GBP',
        data: {
          CHANGEPCT24HOUR: 5.947834565694315,
          PRICE: 130.39,
          VOLUME24HOURTO: 1897390.3205589484,
        },
      }],
    });
    return shallowMount(SingleTransaction, options);
  }

  function storeInit(custom) {
    storeMocks = createStoreMocks(custom);
    router = createRouter(storeMocks.store);
    router.push({ path: '/wallet/single/4' });
    wrapper = wrapperInit({
      i18n, router, localVue, store: storeMocks.store, propsData,
    });
  }

  beforeEach(() => { return storeInit(); });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('displays a received Bitcoin transaction', () => {
    wrapper.setProps({
      data: {
        amount: 4.97,
        sender: ['1CK6KHY6MHgYvmRQ4PAafKYDrg1ejbH1cE'],
        hash: 'd02995c1faf572c5d9ae966915aa7958c88ed2e47f8f208b68d82d863bf61010',
        sent: false,
        confirmations: 12,
        status: 2,
        blockHeight: 245,
        fee: 0.01,
      },
    });
    expect(wrapper.vm.paymentDirection).toEqual('From: 1CK6KHY6MHgYvmRQ4PAafKYDrg1ejbH1cE');
    expect(wrapper.contains('.positive-amount')).toBe(true);
    expect(wrapper.contains('.confirmed-tx')).toBe(true);
    expect(wrapper.find('.confirmed-tx').text()).toEqual(wrapper.vm.$t('confirmed'));
    expect(wrapper.find('.tx-fee').text()).toEqual('0.01 BTC (£38.45)');
  });

  it('displays a sent Bitcoin transaction', () => {
    expect(wrapper.vm.paymentDirection).toEqual('To: 1CK6KHY6MHgYvmRQ4PAafKYDrg1ejbH1cE');
    expect(wrapper.contains('.negative-amount')).toBe(true);
    expect(wrapper.contains('.confirmed-tx')).toBe(true);
    expect(wrapper.find('.confirmed-tx').text()).toEqual(wrapper.vm.$t('confirmed'));
    expect(wrapper.find('.tx-fee').text()).toEqual('0.1 BTC (£384.52)');
  });

  it('displays a received Ethereum transaction', () => {
    router.push({ path: '/wallet/single/5' });
    wrapper.setProps({
      data: {
        amount: 3.654,
        sender: '0x8f52d186aa4a6b169abe85d999dcbe289aa215f8',
        hash: '0xdd1cb7b94395b3b0b81e38e898e2128b8e71d47c810f3450b252e216bb9039ba',
        sent: false,
        confirmations: 8,
        blockHeight: 96773,
        fee: 0.1,
      },
    });
    expect(wrapper.vm.paymentDirection).toEqual('From: 0x8f52d186aa4a6b169abe85d999dcbe289aa215f8');
    expect(wrapper.contains('.positive-amount')).toBe(true);
    expect(wrapper.contains('.unconfirmed-tx')).toBe(true);
    expect(wrapper.find('.unconfirmed-tx').text()).toEqual(wrapper.vm.$t('unconfirmed'));
    expect(wrapper.find('.tx-fee').text()).toEqual('0.1 ETH (£13.04)');
  });

  it('displays a sent Ethereum transaction', () => {
    router.push({ path: '/wallet/single/5' });
    wrapper.setProps({
      data: {
        amount: 20,
        receiver: '0x0a1443a629847f4d487cf1cf00c5b417bb27238f',
        hash: '0x629ecef1111fedc99851efdf97e94645335a8ca19361f0401601f1008cf4714c',
        sent: true,
        confirmations: -1,
        blockHeight: 2354,
        fee: 0.1,
      },
    });
    expect(wrapper.vm.paymentDirection).toEqual('To: 0x0a1443a629847f4d487cf1cf00c5b417bb27238f');
    expect(wrapper.contains('.negative-amount')).toBe(true);
    expect(wrapper.contains('.unconfirmed-tx')).toBe(true);
    expect(wrapper.find('.unconfirmed-tx').text()).toEqual(wrapper.vm.$t('pending'));
    expect(wrapper.find('.tx-fee').text()).toEqual('0.1 ETH (£13.04)');
  });

  it('displays a received ERC20 transaction', () => {
    router.push({ path: '/wallet/single/6' });
    wrapper.setProps({
      data: {
        amount: 25,
        sender: '0x8f52d186aa4a6b169abe85d999dcbe289aa215f8',
        hash: '0x9774378c83edcbf35c584f18ca8b0620b0d69cca2c8c346a963c3c7466636733',
        sent: false,
        confirmations: 130,
        blockHeight: 24539,
        fee: 0.1,
      },
    });
    expect(wrapper.vm.paymentDirection).toEqual('From: 0x8f52d186aa4a6b169abe85d999dcbe289aa215f8');
    expect(wrapper.contains('.positive-amount')).toBe(true);
    expect(wrapper.contains('.confirmed-tx')).toBe(true);
    expect(wrapper.find('.confirmed-tx').text()).toEqual(wrapper.vm.$t('confirmed'));
    expect(wrapper.find('.tx-fee').text()).toEqual('0.1 ETH (£13.04)');
  });

  it('displays a sent ERC20 transaction', () => {
    router.push({ path: '/wallet/single/6' });
    wrapper.setProps({
      data: {
        amount: 100,
        receiver: '0xcc345035d14458b3c012977f96fa1e116760d60a',
        hash: '0x4b796488cdad06be0b74bc5f3f43ba9f0def3880c6e9919a540bf8fdfb3fe015',
        sent: true,
        confirmations: -1,
        blockHeight: 87,
        fee: 0.1,
      },
    });
    expect(wrapper.vm.paymentDirection).toEqual('To: 0xcc345035d14458b3c012977f96fa1e116760d60a');
    expect(wrapper.contains('.negative-amount')).toBe(true);
    expect(wrapper.contains('.unconfirmed-tx')).toBe(true);
    expect(wrapper.find('.unconfirmed-tx').text()).toEqual(wrapper.vm.$t('pending'));
    expect(wrapper.find('.tx-fee').text()).toEqual('0.1 ETH (£13.04)');
  });
  it('displays a Litecoin transaction', () => {
    router.push({ path: '/wallet/single/7' });
    expect(wrapper.vm.paymentDirection).toEqual('To: 1CK6KHY6MHgYvmRQ4PAafKYDrg1ejbH1cE');
    expect(wrapper.contains('.negative-amount')).toBe(true);
    expect(wrapper.contains('.confirmed-tx')).toBe(true);
    expect(wrapper.find('.confirmed-tx').text()).toEqual(wrapper.vm.$t('confirmed'));
    expect(wrapper.find('.tx-fee').text()).toEqual('0.1 LTC');
  });
});
