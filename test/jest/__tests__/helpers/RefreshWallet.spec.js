/* eslint-disable no-magic-numbers */
import RefreshWallet from '@/helpers/RefreshWallet';
import Address from '@/store/wallet/entities/address';
import Wallet from '@/store/wallet/entities/wallet';
import Tx from '@/store/wallet/entities/tx';
import Utxo from '@/store/wallet/entities/utxo';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';


const mockCoinSDK = {
  getTransactionHistory: jest.fn().mockImplementation(() => { return null; }),
  getUTXOs: jest.fn().mockImplementation(() => {
    return [
      {
        id: 1,
        txid: '9e792178e63be3d05b7f03f822c060909bd9fa5c451ce4ab11c1827108c5fb6d',
        vout: 0,
        wallet_id: 5,
        amount: 1,
      },
      {
        id: 2,
        txid: '9e792178e63be3d05b7f03f822c060909bd9fa5c451ce4ab11c1827108c5fb6e',
        vout: 0,
        wallet_id: 5,
        amount: 2,
      },
    ];
  }),
  getBalance: jest.fn(),
  generateAddress: jest.fn().mockImplementation(() => { return { address: '2NwSB1utt5aMRp8tY92wNjBpb96UfpDKHX7', index: 5 }; }),
};

const mockTxs = [
  {
    hash: '123', wallet_id: 3, confirmations: 5, sent: true,
  },
  {
    hash: '456', wallet_id: 4, confirmations: 5, sent: true,
  },
  {
    hash: '789', wallet_id: 5, confirmations: 12, sent: true,
  },
  {
    hash: '222', wallet_id: 5, confirmations: 1, sent: false,
  },
];

const bitcoinWalletData = JSON.parse('{"$id":5,"id":5,"account_id":1,"name":"Bitcoin","displayName":"Bitcoin","symbol":"BTC","sdk":"Bitcoin","network":"BITCOIN_TESTNET","internalChainAddressIndex":0,"externalChainAddressIndex":1,"externalAddress":"2MwSB1utt5aMRp8tY92wNjBpb96UfpDKHX6","confirmedBalance":0,"unconfirmedBalance":0,"imported":true,"enabled":true,"lastBlockHeight":0,"parentName":"","parentSdk":"","contractAddress":"","decimals":"","hdWallet":{"bip":49,"ext":{"xpriv":"xprv9zZZrtcYB6bg2sxhoVYYKAM8duZHP1MwV1SYNVLStU6qpY6NCKfuTCeeHe1MsBeYDt7XipqZYtshoGC9ghNZ6EVwugKxUPM7m2tFmExu2mt","xpub":"xpub6DYvGQ9S1U9yFN3AuX5YgJHsBwPmnU5nrEN9Ask4SodphLRWjrz9zzy88v6HFPGJuDoMg7hhEG2yFFhU7Djqx3AoE57hEL748iFp26JLXtC"},"int":{"xpriv":"xprv9zZZrtcYB6bg6LXLr8kweVuqCWUTc5dnFDJ526bEyz5pLHdfHRx2D1UPLE8bZy6hK8f1YpXQHeGF2FWEds5S1MSbTH2boaQRNUoz6vy4MRq","xpub":"xpub6DYvGQ9S1U9yJpboxAHx1drZkYJx1YMdcSDfpUzrYKcoD5xopyGGkonsBXbmCnHteYYMcjgWRU7EyByaGf8Mav4y5BTkYmC2TD2JVPmkJxs"},"type":1,"network":{"name":"BITCOIN_TESTNET","type":"testnet","bip":1,"segwit":true,"discovery":"http://92.207.178.198:3001/api","broadcastUrl":"https://chain.so/api/v2/send_tx/BTCTEST","feeApi":"https://api.blockcypher.com/v1/btc/main","connect":{"messagePrefix":"Bitcoin Signed Message:","bech32":"tb","bip32":{"public":70617039,"private":70615956},"pubKeyHash":111,"scriptHash":196,"wif":239}}},"erc20Wallet":""}');
const walletData = JSON.parse('{"$id":3,"id":3,"account_id":1,"name":"Ethereum","displayName":"Ethereum","symbol":"ETH","sdk":"Ethereum","network":"ETHEREUM","internalChainAddressIndex":0,"externalChainAddressIndex":1,"externalAddress":null,"confirmedBalance":10,"unconfirmedBalance":0,"imported":true,"enabled":true,"lastBlockHeight":0,"parentName":"","parentSdk":"","contractAddress":"","decimals":"","hdWallet":{"bip":49,"ext":{"xpriv":"xprv9zZZrtcYB6bg2sxhoVYYKAM8duZHP1MwV1SYNVLStU6qpY6NCKfuTCeeHe1MsBeYDt7XipqZYtshoGC9ghNZ6EVwugKxUPM7m2tFmExu2mt","xpub":"xpub6DYvGQ9S1U9yFN3AuX5YgJHsBwPmnU5nrEN9Ask4SodphLRWjrz9zzy88v6HFPGJuDoMg7hhEG2yFFhU7Djqx3AoE57hEL748iFp26JLXtC"},"int":{"xpriv":"xprv9zZZrtcYB6bg6LXLr8kweVuqCWUTc5dnFDJ526bEyz5pLHdfHRx2D1UPLE8bZy6hK8f1YpXQHeGF2FWEds5S1MSbTH2boaQRNUoz6vy4MRq","xpub":"xpub6DYvGQ9S1U9yJpboxAHx1drZkYJx1YMdcSDfpUzrYKcoD5xopyGGkonsBXbmCnHteYYMcjgWRU7EyByaGf8Mav4y5BTkYmC2TD2JVPmkJxs"},"type":1,"network":{"name":"BITCOIN_TESTNET","type":"testnet","bip":1,"segwit":true,"discovery":"http://92.207.178.198:3001/api","broadcastUrl":"https://chain.so/api/v2/send_tx/BTCTEST","feeApi":"https://api.blockcypher.com/v1/btc/main","connect":{"messagePrefix":"Bitcoin Signed Message:","bech32":"tb","bip32":{"public":70617039,"private":70615956},"pubKeyHash":111,"scriptHash":196,"wif":239}}},"erc20Wallet":""}');
const erc20WalletData = JSON.parse('{"$id":4,"id":4,"account_id":1,"name":"Catalyst","displayName":"Catalyst","symbol":"CAT","sdk":"ERC20","network":"ETHEREUM","internalChainAddressIndex":0,"externalChainAddressIndex":1,"externalAddress":null,"confirmedBalance":10,"unconfirmedBalance":0,"imported":true,"enabled":true,"lastBlockHeight":0,"parentName":"Ethereum","parentSdk":"Ethereum","contractAddress":"123","decimals":"3","hdWallet":{"bip":49,"ext":{"xpriv":"xprv9zZZrtcYB6bg2sxhoVYYKAM8duZHP1MwV1SYNVLStU6qpY6NCKfuTCeeHe1MsBeYDt7XipqZYtshoGC9ghNZ6EVwugKxUPM7m2tFmExu2mt","xpub":"xpub6DYvGQ9S1U9yFN3AuX5YgJHsBwPmnU5nrEN9Ask4SodphLRWjrz9zzy88v6HFPGJuDoMg7hhEG2yFFhU7Djqx3AoE57hEL748iFp26JLXtC"},"int":{"xpriv":"xprv9zZZrtcYB6bg6LXLr8kweVuqCWUTc5dnFDJ526bEyz5pLHdfHRx2D1UPLE8bZy6hK8f1YpXQHeGF2FWEds5S1MSbTH2boaQRNUoz6vy4MRq","xpub":"xpub6DYvGQ9S1U9yJpboxAHx1drZkYJx1YMdcSDfpUzrYKcoD5xopyGGkonsBXbmCnHteYYMcjgWRU7EyByaGf8Mav4y5BTkYmC2TD2JVPmkJxs"},"type":1,"network":{"name":"BITCOIN_TESTNET","type":"testnet","bip":1,"segwit":true,"discovery":"http://92.207.178.198:3001/api","broadcastUrl":"https://chain.so/api/v2/send_tx/BTCTEST","feeApi":"https://api.blockcypher.com/v1/btc/main","connect":{"messagePrefix":"Bitcoin Signed Message:","bech32":"tb","bip32":{"public":70617039,"private":70615956},"pubKeyHash":111,"scriptHash":196,"wif":239}}},"erc20Wallet":""}');

const addressData = JSON.parse('{"$id":1,"id":1,"wallet_id":5,"account_id":1,"address":"2MwSB1utt5aMRp8tY92wNjBpb96UfpDKHX7","index":0,"chain":"internal","used":false}');

const utxoData = JSON.parse('{"$id":1,"id":1,"account_id":1,"wallet_id":5,"pending":true,"address":"2MwSB1utt5aMRp8tY92wNjBpb96UfpDKHX8","amount":0.0027175,"scriptPubKey":"a9142df2990ee914d0a0c0dc8ed92abe91642d7a415b87","txid":"9e792178e63be3d05b7f03f822c060909bd9fa5c451ce4ab11c1827108c5fb6d","value":271750,"vout":0}');

describe('RefreshWallet', () => {
  function storeInit() {
    createStoreMocks();
    Tx.$update = Tx.update;
    Wallet.$update = Wallet.update;
    Address.$update = Address.update;
    Wallet.insert({ data: [bitcoinWalletData, walletData] });
    Wallet.insert({ data: erc20WalletData });
    Address.insert({ data: [addressData] });
    Utxo.insert({ data: utxoData });
  }

  beforeEach(() => {
    jest.clearAllMocks();
    return storeInit();
  });

  it('can refresh a bitcoin wallet with no transaction history', async () => {
    await RefreshWallet(mockCoinSDK, Wallet.all()[2], 1);
    expect(mockCoinSDK.getTransactionHistory).toHaveBeenCalled();
  });

  it('can refresh an ethereum wallet with no transaction history', async () => {
    await RefreshWallet(mockCoinSDK, Wallet.all()[0], 1);
    expect(mockCoinSDK.getTransactionHistory).toHaveBeenCalled();
  });

  it('can refresh an erc20 wallet with no transaction history', async () => {
    await RefreshWallet(mockCoinSDK, Wallet.all()[1], 1);
    expect(mockCoinSDK.getTransactionHistory).toHaveBeenCalled();
  });

  it('can refresh a bitcoin wallet with transaction history', async () => {
    mockCoinSDK.getTransactionHistory.mockReturnValue({
      txs: [{
        hash: '789', wallet_id: 5, confirmations: 15, sent: true, receiver: ['2MwSB1utt5aMRp8tY92wNjBpb96UfpDKHX7'], sender: ['2MwSB1utt5aMRp8tY92wNjBpb96UfpDKHX8'],
      },
      {
        hash: '111', wallet_id: 5, confirmations: 1, sent: false, receiver: ['2MwSB1utt5aMRp8tY92wNjBpb96UfpDKHX6'],
      },
      {
        hash: '222', wallet_id: 5, confirmations: 6, sent: false,
      },
      {
        hash: '333', wallet_id: 5, confirmations: 1, sent: true, receiver: ['2WwSB1utt5aMRp8tY92wNjBpb96UfpDKHX6'],
      }],
    });
    mockCoinSDK.getBalance.mockReturnValue('15');
    Tx.insert({ data: mockTxs });
    await RefreshWallet(mockCoinSDK, Wallet.all()[2], 1);
    expect(Tx.all()[2].confirmations).toBe(15);
    expect(Tx.all()[4].hash).toBe('111');
    expect(Address.all().length).toBe(2);
    expect(Wallet.all()[2].externalAddress).toBe('2NwSB1utt5aMRp8tY92wNjBpb96UfpDKHX7');
    expect(Wallet.all()[2].confirmedBalance).toBe(3);
    expect(Utxo.all().length).toBe(2);
  });

  it('can refresh an ethereum wallet with transaction history', async () => {
    mockCoinSDK.getTransactionHistory.mockReturnValue({
      txs: [{
        hash: '123', wallet_id: 3, confirmations: 8, sent: true,
      },
      {
        hash: '456', wallet_id: 3, confirmations: 1, sent: false,
      }],
    });
    mockCoinSDK.getBalance.mockReturnValue('15');
    Tx.insert({ data: mockTxs });
    await RefreshWallet(mockCoinSDK, Wallet.all()[0], 1);
    expect(Tx.all()[0].confirmations).toBe(8);
    expect(Tx.all()[4].hash).toBe('456');
    expect(Wallet.all()[0].confirmedBalance).toBe(15);
  });

  it('can refresh an ERC20 wallet with transaction history', async () => {
    mockCoinSDK.getTransactionHistory.mockReturnValue([{
      hash: '123', wallet_id: 4, confirmations: 8, sent: false,
    },
    {
      hash: '456', wallet_id: 4, confirmations: 6, sent: true,
    }]);
    mockCoinSDK.getBalance.mockReturnValue('10');
    Tx.insert({ data: mockTxs });
    await RefreshWallet(mockCoinSDK, Wallet.all()[1], 1);
    expect(Tx.all()[1].confirmations).toBe(6);
    expect(Tx.all()[4].hash).toBe('123');
    expect(Wallet.all()[0].confirmedBalance).toBe(10);
  });
});
