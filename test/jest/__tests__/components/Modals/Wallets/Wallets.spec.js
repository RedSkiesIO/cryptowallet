/* eslint-disable no-magic-numbers */
import Wallets from '@/components/Modals/Wallets';
import { shallowMount } from '@vue/test-utils';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';
// import SupportedCoins from '@/store/settings/state/supportedCoins.js';
// import Coin from '@/store/wallet/entities/coin';
import Wallet from '@/store/wallet/entities/wallet';
import Address from '@/store/wallet/entities/address';
// import Tx from '@/store/wallet/entities/tx';
// import Utxo from '@/store/wallet/entities/utxo';
// import Prices from '@/store/prices';


describe('Modals/Wallets.vue', () => {
  let storeMocks;
  let wrapper;
  let router;
  Address.$insert = Address.insert;

  const bitcoinWallet = {
    id: 2,
    account_id: 1,
    name: 'Bitcoin',
    displayName: 'Bitcoin',
    symbol: 'BTC',
    network: 'BITCOIN',
    sdk: 'Bitcoin',
    enabled: true,
    imported: false,
    hdWallet: {},
  };
  const mockPriceFeed = {
    data: [{ price: 3000 }],
  };
  const mockChartData = {
    data: {
      x: 3001,
      y: 123456,
    },
  };
  const coinSDKS = {
    Bitcoin: {
      generateKeyPair: jest.fn(() => {
        return {
          address: '000000',
        };
      }),

    },
    Ethereum: {
      generateKeyPair: jest.fn(),
    },
    ERC20: {
      generateERC20Wallet: jest.fn(),
    },
  };
  const discovery = {
    txHistory: { txs: [] },
    externalAccountDiscovery: { active: [] },
    internalAccountDiscovery: { used: [] },
    externalChainAddressIndex: 0,
    internalChainAddressIndex: 0,
    utxos: [],
  };
  const backEndService = {
    getPriceFeed: jest.fn(),
    storePriceData: jest.fn(),
    getHistoricalData: jest.fn(),
  };

  const activeWallets = {};
  const errorHandler = jest.fn();
  const discoverWallet = jest.fn(() => {
    return discovery;
  });

  const propsData = {
    clickItemAction: 'addWallet',
  };

  const mocks = {
    coinSDKS,
    backEndService,
    activeWallets,
    errorHandler,
    discoverWallet,
  };

  function wrapperInit(options) {
    return shallowMount(Wallets, options);
  }

  function storeInit(custom) {
    storeMocks = createStoreMocks(custom);
    router = createRouter(storeMocks.store);
    router.push({ path: '/wallet/' });
    wrapper = wrapperInit({
      i18n,
      router,
      localVue,
      store: storeMocks.store,
      propsData,
      mocks,
    });
  }
  beforeEach(() => { jest.clearAllMocks(); });

  it('renders and matches snapshot', () => {
    storeInit();
    expect(wrapper.element).toMatchSnapshot();
  });

  it('renders the wallets list', () => {
    storeInit();
    expect(wrapper.contains('walletsList-stub')).toBe(true);
  });

  it('closes the modal if no wallets need to be enabled', () => {
    storeInit();
    wrapper.vm.addWalletModalOpened = true;
    wrapper.vm.close();
    expect(wrapper.vm.addWalletModalOpened).toBe(false);
  });

  describe('enableWallet()', () => {
    it('displays a loading spinner when enabling a wallet', (done) => {
      storeInit();
      Wallet.$insert({ data: [bitcoinWallet] });
      wrapper.vm.addWalletModalOpened = true;
      wrapper.vm.close();
      expect(wrapper.contains('spinner-stub')).toBe(true);
      expect(wrapper.vm.loading).toBe(true);
      setTimeout(() => {
        expect(wrapper.contains('spinner-stub')).toBe(false);
        expect(wrapper.vm.loading).toBe(false);
        done();
      }, 0);
    });

    it('fetches the price data and if available stores it in the database', (done) => {
      backEndService.getPriceFeed.mockReturnValueOnce(mockPriceFeed);
      storeInit();
      backEndService.getHistoricalData.mockReturnValue(mockChartData);
      Wallet.$insert({ data: [bitcoinWallet] });
      wrapper.vm.addWalletModalOpened = true;
      wrapper.vm.close();
      setTimeout(() => {
        expect(backEndService.getPriceFeed).toHaveBeenCalledTimes(1);
        expect(backEndService.storePriceData).toHaveBeenCalled();
        expect(backEndService.getHistoricalData).toHaveBeenCalledTimes(3);
        done();
      }, 0);
    });

    it('enables a wallet without any price data', (done) => {
      storeInit();
      backEndService.getHistoricalData.mockReturnValue(mockChartData);
      Wallet.$insert({ data: [bitcoinWallet] });
      wrapper.vm.addWalletModalOpened = true;
      wrapper.vm.close();
      setTimeout(() => {
        expect(backEndService.getPriceFeed).toHaveBeenCalledTimes(1);
        done();
      }, 0);
    });
  });

  describe('enableBitcoin()', () => {
    it('it updates the wallet database with the current address ', (done) => {
      backEndService.getPriceFeed.mockReturnValueOnce(mockPriceFeed);
      storeInit();
      backEndService.getHistoricalData.mockReturnValue(mockChartData);
      Wallet.$insert({ data: [bitcoinWallet] });
      wrapper.vm.addWalletModalOpened = true;
      wrapper.vm.close();
      setTimeout(() => {
        const addresses = Address.all();
        expect(addresses.length).toEqual(1);
        expect(addresses[0].address).toEqual('000000');
        done();
      }, 0);
    });

    it('it store the tx and utxo history in the database ', (done) => {
      discovery.txHistory.txs = [{ confirmed: true }, { confirmed: false }];
      discovery.txHistory.txs = [{ confirmed: true }, { confirmed: false }];
      backEndService.getPriceFeed.mockReturnValueOnce(mockPriceFeed);
      storeInit();
      backEndService.getHistoricalData.mockReturnValue(mockChartData);
      Wallet.$insert({ data: [bitcoinWallet] });
      wrapper.vm.addWalletModalOpened = true;
      wrapper.vm.close();
      setTimeout(() => {
        const addresses = Address.all();
        expect(addresses.length).toEqual(1);
        expect(addresses[0].address).toEqual('000000');
        done();
      }, 0);
    });
  });
});
