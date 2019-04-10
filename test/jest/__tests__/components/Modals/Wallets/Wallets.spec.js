/* eslint-disable no-magic-numbers */
import Wallets from '@/components/Modals/Wallets';
import { shallowMount } from '@vue/test-utils';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';
// import SupportedCoins from '@/store/settings/state/supportedCoins.js';
// import Coin from '@/store/wallet/entities/coin';
import Wallet from '@/store/wallet/entities/wallet';
import Address from '@/store/wallet/entities/address';
import Tx from '@/store/wallet/entities/tx';
import Utxo from '@/store/wallet/entities/utxo';
import Prices from '@/store/prices';


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
  const ethereumWallet = {
    id: 3,
    account_id: 1,
    name: 'Ethereum',
    displayName: 'Ethereum',
    symbol: 'ETH',
    network: 'ETHEREUM',
    sdk: 'Ethereum',
    enabled: true,
    imported: false,
    hdWallet: {},
  };
  const erc20Wallet = {
    id: 4,
    account_id: 1,
    name: 'Catalyst',
    displayName: 'Catalyst',
    symbol: 'CAT',
    network: 'ETHEREUM',
    sdk: 'ERC20',
    parentSdk: 'Ethereum',
    parentName: 'Ethereum',
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
      generateKeyPair: jest.fn(() => {
        return {
          address: '000000',
        };
      }),
    },
    ERC20: {
      generateERC20Wallet: jest.fn(() => {
        return {
          address: '000000',
        };
      }),
    },
  };
  const discovery = {
    txHistory: { txs: [] },
    accounts: {},
    balance: {},
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

  it('opens the modal on walletsModalOpened event', () => {
    storeInit();
    wrapper.vm.$root.$emit('walletsModalOpened', true);
    expect(wrapper.vm.addWalletModalOpened).toBe(true);
  });

  it('catches errors', (done) => {
    backEndService.getPriceFeed.mockImplementationOnce(() => {
      throw new Error('Test error');
    });
    storeInit();
    Wallet.$insert({ data: [bitcoinWallet] });
    Wallet.$insert({ data: [erc20Wallet] });
    wrapper.vm.addWalletModalOpened = true;
    wrapper.vm.close();
    setTimeout(() => {
      expect(errorHandler).toHaveBeenCalledTimes(2);
      done();
    }, 0);
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

    it('catches errors', () => {
      coinSDKS.Bitcoin.generateKeyPair.mockImplementationOnce(() => {
        throw new Error('Test error');
      });
      storeInit();
      Wallet.$insert({ data: [bitcoinWallet] });
      wrapper.vm.addWalletModalOpened = true;
      wrapper.vm.close();
      setTimeout(() => {
        expect(errorHandler).toHaveBeenCalled();
      }, 0);
    });
  });

  describe('enableBitcoin()', () => {
    it('it updates the wallet database with the next address', (done) => {
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

    it('it store the tx and utxo history in the database', (done) => {
      discovery.txHistory.txs = [{ confirmed: true }, { confirmed: false }];
      discovery.utxos = [{ confirmed: true }, { confirmed: false }];
      backEndService.getPriceFeed.mockReturnValueOnce(mockPriceFeed);
      storeInit();
      backEndService.getHistoricalData.mockReturnValue(mockChartData);
      Wallet.$insert({ data: [bitcoinWallet] });
      wrapper.vm.addWalletModalOpened = true;
      wrapper.vm.close();
      setTimeout(() => {
        const transactions = Tx.all();
        const utxos = Utxo.all();
        expect(transactions.length).toEqual(2);
        expect(utxos.length).toEqual(2);
        done();
      }, 0);
    });

    it('it stores the external and change addresses in the database', (done) => {
      discovery.externalAccountDiscovery.active = [
        { index: 0, address: '123' },
        { index: 1, address: '456' },
        { index: 2, address: '789' }];
      discovery.internalAccountDiscovery.used = [
        { index: 0, address: '321' },
        { index: 1, address: '654' },
        { index: 2, address: '987' }];
      backEndService.getPriceFeed.mockReturnValueOnce(mockPriceFeed);
      storeInit();
      backEndService.getHistoricalData.mockReturnValue(mockChartData);
      Wallet.$insert({ data: [bitcoinWallet] });
      wrapper.vm.addWalletModalOpened = true;
      wrapper.vm.close();
      setTimeout(() => {
        const addresses = Address.all();
        expect(addresses.length).toBe(7);
        done();
      }, 0);
    });
  });
  describe('enableEthereum()', () => {
    it('it updates the wallet database with the next address', (done) => {
      discovery.accounts = [{ index: 0, address: '123' }];
      backEndService.getPriceFeed.mockReturnValueOnce(mockPriceFeed);
      storeInit();
      backEndService.getHistoricalData.mockReturnValue(mockChartData);
      Wallet.$insert({ data: [ethereumWallet] });
      wrapper.vm.addWalletModalOpened = true;
      wrapper.vm.close();
      setTimeout(() => {
        const wallets = Wallet.all();
        const addresses = Address.all();
        expect(wallets[0].externalAddress).toBe('123');
        expect(addresses.length).toEqual(1);
        expect(addresses[0].address).toEqual('123');
        done();
      }, 0);
    });

    it('it sorts and stores the transaction history in the database', (done) => {
      discovery.txHistory.txs = [
        { confirmedTime: 121, confirmed: true },
        { confirmedTime: 122, confirmed: false },
      ];
      backEndService.getPriceFeed.mockReturnValueOnce(mockPriceFeed);
      storeInit();
      backEndService.getHistoricalData.mockReturnValue(mockChartData);
      Wallet.$insert({ data: [ethereumWallet] });
      wrapper.vm.addWalletModalOpened = true;
      wrapper.vm.close();
      setTimeout(() => {
        const txs = Tx.all();
        expect(txs.length).toEqual(2);
        expect(txs[0].confirmed).toBe(false);
        done();
      }, 0);
    });
  });

  describe('enableErc20Wallet()', () => {
    it('it enables the ethereum wallet before enabling the ERC20 wallet', (done) => {
      discovery.txHistory.txs = [{ confirmed: true }, { confirmed: false }];
      discovery.accounts = [{ index: 0, address: '123' }];
      backEndService.getPriceFeed.mockReturnValue(mockPriceFeed);
      storeInit();
      Wallet.$insert({ data: [erc20Wallet] });
      Wallet.$insert({ data: [ethereumWallet] });
      wrapper.vm.addWalletModalOpened = true;
      wrapper.vm.close();
      setTimeout(() => {
        const wallets = Wallet.all();
        const addresses = Address.all();
        expect(wallets.length).toEqual(2);
        expect(addresses[0].wallet_id).toEqual(3);
        expect(addresses[1].wallet_id).toEqual(4);
        done();
      }, 0);
    });

    it('it sorts and stores the transaction history', (done) => {
      discovery.txHistory = [{ confirmed: true }, { confirmed: false }];
      discovery.accounts = [{ index: 0, address: '123' }];
      backEndService.getPriceFeed.mockReturnValueOnce('');
      storeInit();
      Wallet.$insert({ data: [erc20Wallet] });
      ethereumWallet.imported = true;
      Wallet.$insert({ data: [ethereumWallet] });
      wrapper.vm.addWalletModalOpened = true;
      wrapper.vm.close();
      setTimeout(() => {
        const txs = Tx.all();
        expect(txs.length).toEqual(2);
        expect(txs[0].confirmed).toBe(false);
        done();
      }, 0);
    });
  });

  describe('storeChartData()', () => {
    it('stores the price data if data does not exist', async (done) => {
      wrapper.vm.storeChartData('BTC', 'day', mockChartData);
      setTimeout(() => {
        expect(Prices.all()[0].data).toBe(mockChartData);
        done();
      }, 0);
    });

    it('checks if price data exists and updates if true', () => {
      Prices.$insert({
        data: {
          coin: 'BTC',
          currency: 'GBP',
          period: 'day',
          updated: +new Date(),
          data: ['old data'],
        },
      });
      expect(Prices.all()[0].data).toEqual(['old data']);
      const dataTimestamp = Prices.all()[0].updated;
      wrapper.vm.storeChartData('BTC', 'day', mockChartData);
      setTimeout(() => {
        expect(Prices.all().length).toBe(1);
        expect(Prices.all()[0].data).toBe(mockChartData);
        expect(Prices.all()[0].updated > dataTimestamp).toBe(true);
      }, 0);
    });
  });
});