/* eslint-disable no-magic-numbers */
import WalletDiscovery from '@/boot/WalletDiscovery/';
import { shallowMount } from '@vue/test-utils';
import { localVue, i18n } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';

let wrapperMock;
let discoveryInstance;
let network = 'BITCOIN';
const { store } = createStoreMocks();
const wallet = {
  address: 'address',
};
const coinSDK = {
  accountDiscovery: jest.fn(),
  getTransactionHistory: jest.fn(),
  getBalance: jest.fn(),
  getUTXOs: jest.fn(),
};
const mockExternal = {
  change: false,
  nextAddress: 2,
  active: [
    {
      address: '2N2PMJwMoj7TbB1bvGz2gEFwc5ePJzqcu5g',
      balance: 0,
      index: 0,
      received: 0.46666667,
    }, {
      address: '2N3sy5gP2EmDJdxmTv8xBpW1vy6J3oHb6E8',
      balance: 0.00066667,
      chain: 'external',
      index: 2,
      received: 0.10944532,
    }],
};
const mockInternal = {
  change: true,
  nextAddress: 23,
  active: [{
    address: '2NCwU4CD3TPHZ5BbFz5pCmW6z9HpPUVyBCR',
    balance: 0.19307975,
    index: 12,
    received: 0.19307975,
  }, {
    address: '2NCn7UyoxcWse8nUZFQpKuasi97J1FTd1mH',
    balance: 0.20386156,
    index: 22,
    received: 0.20386156,
  }],
  used: [{
    address: '2MwYAWfXtp3isDyVdFbqGSMbQiLx4WBiDYg',
    balance: 0,
    index: 1,
    received: 0.23298424,
  }],
};
const mockUTXOs = [{
  address: '2N5fHqv1V4eLqSy9nFqqcwNuBxXg7Q9N2JN',
  amount: 0.001,
  confirmations: 2450,
  height: 1485251,
  satoshis: 100000,
  scriptPubKey: 'a914882eb608841bb93a70f79204ab39d6b52ce9c89987',
  txid: 'd02995c1faf572c5d9ae966915aa7958c88ed2e47f8f208b68d82d863bf61010',
  value: 100000,
  vout: 0,
}];

describe('boot/WalletDiscovery', () => {
  beforeEach(() => {
    wrapperMock = shallowMount({ name: 'mock', template: '<div/>' }, { i18n, localVue, store });
  });

  it('exports a function', async () => {
    expect(typeof WalletDiscovery).toBe('function');
  });

  it('discovers a Bitcoin wallet', async () => {
    coinSDK.accountDiscovery.mockResolvedValueOnce(mockExternal);
    coinSDK.accountDiscovery.mockResolvedValueOnce(mockInternal);
    coinSDK.getUTXOs.mockResolvedValue(mockUTXOs);
    coinSDK.getTransactionHistory.mockResolvedValue([]);
    const {
      externalAccountDiscovery,
      internalAccountDiscovery,
      externalChainAddressIndex,
      internalChainAddressIndex,
      balance,
      utxos,
    } = await wrapperMock.vm.discoverWallet(wallet, coinSDK, network, 'Bitcoin');

    expect(coinSDK.accountDiscovery).toHaveBeenCalled();
    expect(coinSDK.getTransactionHistory).toHaveBeenCalled();
    expect(coinSDK.getUTXOs).toHaveBeenCalled();
    expect(externalAccountDiscovery).toBe(mockExternal);
    expect(internalAccountDiscovery).toBe(mockInternal);
    expect(externalChainAddressIndex).toBe(2);
    expect(internalChainAddressIndex).toBe(23);
    expect(balance).toBe(0.001);
    expect(utxos).toBe(mockUTXOs);
  });

  it('discovers an Ethereum wallet', async () => {
    network = 'ETHEREUM';
    coinSDK.accountDiscovery.mockResolvedValueOnce([{
      address: '0x3Fd548d4BA96452E6c33A5d6492d321E80f4734e',
      index: 0,
    }]);
    coinSDK.getTransactionHistory.mockResolvedValue();
    coinSDK.getBalance.mockResolvedValueOnce(5);
    discoveryInstance = await wrapperMock.vm.discoverWallet(wallet, coinSDK, network, 'Ethereum');
    expect(coinSDK.accountDiscovery).toHaveBeenCalled();
    expect(coinSDK.getTransactionHistory).toHaveBeenCalled();
    expect(coinSDK.getBalance).toHaveBeenCalled();
    expect(discoveryInstance.balance).toBe(5);
  });

  it('discovers an ERC20 wallet', async () => {
    network = 'ETHEREUM';
    coinSDK.getBalance.mockResolvedValueOnce(25);
    discoveryInstance = await wrapperMock.vm.discoverWallet(wallet, coinSDK, network, 'ERC20');
    expect(coinSDK.getTransactionHistory).toHaveBeenCalled();
    expect(coinSDK.getBalance).toHaveBeenCalled();
    expect(discoveryInstance.balance).toBe(25);
  });

  it('full transaction history is fetched in discoverBitcoin', async () => {
    coinSDK.getTransactionHistory.mockClear();
    network = 'BITCOIN';
    coinSDK.accountDiscovery.mockResolvedValueOnce(mockExternal);
    coinSDK.accountDiscovery.mockResolvedValueOnce(mockInternal);
    coinSDK.getUTXOs.mockResolvedValue(mockUTXOs);
    coinSDK.getTransactionHistory.mockResolvedValueOnce({
      address: '2N5fHqv1V4eLqSy9nFqqcwNuBxXg7Q9N2JN',
      more: true,
    });
    coinSDK.getTransactionHistory.mockResolvedValueOnce({
      address: '2N5fHqv1V4eLqSy9nFqqcwNuBxXg7Q9N2JN',
      more: false,
    });

    discoveryInstance = await wrapperMock.vm.discoverWallet(wallet, coinSDK, network, 'Bitcoin');
    expect(coinSDK.getTransactionHistory).toHaveBeenCalledTimes(2);
  });

  it('handles empty bitcoin wallets', async () => {
    network = 'BITCOIN';
    coinSDK.accountDiscovery.mockResolvedValueOnce({
      change: false,
      nextAddress: 0,
      active: [],
    });
    coinSDK.accountDiscovery.mockResolvedValueOnce({
      change: true,
      nextAddress: 0,
      active: [],
      used: [],
    });
    coinSDK.getUTXOs.mockResolvedValue([]);
    discoveryInstance = await wrapperMock.vm.discoverWallet(wallet, coinSDK, network, 'Bitcoin');
    expect(discoveryInstance.balance).toBe(0);
  });

  it('handles empty Ethereum wallets', async () => {
    coinSDK.accountDiscovery.mockResolvedValueOnce([{
      address: '0x3Fd548d4BA96452E6c33A5d6492d321E80f4734e',
      index: 0,
    }]);
    coinSDK.getBalance.mockResolvedValueOnce(undefined);
    discoveryInstance = await wrapperMock.vm.discoverWallet(wallet, coinSDK, network, 'Ethereum');
    expect(discoveryInstance.balance).toBe(0);
  });

  it('handles empty ERC20 wallets', async () => {
    coinSDK.getBalance.mockResolvedValueOnce(undefined);
    discoveryInstance = await wrapperMock.vm.discoverWallet(wallet, coinSDK, network, 'ERC20');
    expect(discoveryInstance.balance).toBe(0);
  });

  it('returns false if sdk not recognised', async () => {
    coinSDK.getBalance.mockResolvedValueOnce(undefined);
    discoveryInstance = await wrapperMock.vm.discoverWallet(wallet, coinSDK, network, 'ERC21');
    expect(discoveryInstance).toBe(false);
  });
});
