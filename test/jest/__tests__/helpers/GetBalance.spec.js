/* eslint-disable no-magic-numbers */
import GetBalance from '@/helpers/GetBalance';
import Wallet from '@/store/wallet/entities/wallet';
import Tx from '@/store/wallet/entities/tx';
import Utxo from '@/store/wallet/entities/utxo';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';

const utxoData = [
  {
    account_id: 1, wallet_id: 5, pending: true, address: '2MwSB1utt5aMRp8tY92wNjBpb96UfpDKHX8', amount: 0.2, scriptPubKey: 'a9142df2990ee914d0a0c0dc8ed92abe91642d7a415b87', txid: '9e792178e63be3d05b7f03f822c060909bd9fa5c451ce4ab11c1827108c5fb6d', value: 271750, vout: 0,
  },
  {
    account_id: 1, wallet_id: 5, pending: false, address: '2MwSB1utt5aMRp8tY92wNjBpb96UfpDKHX9', amount: 1, scriptPubKey: 'a9142df2990ee914d0a0c0dc8ed92abe91642d7a415b87', txid: '9e792178e63be3d05b7f03f822c060909bd9fa5c451ce4ab11c1827108c5fb6e', value: 100000000, vout: 0,
  },
];

const mockTxs = [
  {
    account_id: 1, hash: '123', wallet_id: 3, confirmations: 5, sent: true,
  },
  {
    account_id: 1, hash: '124', wallet_id: 3, confirmations: 0, sent: true, value: 5, fee: 0.001,
  },
  {
    account_id: 1, hash: '456', wallet_id: 4, confirmations: 5, sent: true,
  },
  {
    account_id: 1, hash: '124', wallet_id: 4, confirmations: 0, sent: true, value: 2, fee: 0.002,
  },
  {
    account_id: 1, hash: '789', wallet_id: 5, confirmations: 12, sent: true,
  },
  {
    account_id: 1, hash: '777', wallet_id: 5, confirmations: 0, sent: true, value: 0.5, fee: 0.001,
  },
  {
    account_id: 1, hash: '222', wallet_id: 5, confirmations: 1, sent: false,
  },
];

const bitcoinWalletData = JSON.parse('{"$id":5,"id":5,"account_id":1,"name":"Bitcoin","displayName":"Bitcoin","symbol":"BTC","sdk":"Bitcoin","network":"BITCOIN_TESTNET","internalChainAddressIndex":0,"externalChainAddressIndex":1,"externalAddress":"2MwSB1utt5aMRp8tY92wNjBpb96UfpDKHX6","confirmedBalance":0,"unconfirmedBalance":0,"imported":true,"enabled":true,"lastBlockHeight":0,"parentName":"","parentSdk":"","contractAddress":"","decimals":"","hdWallet":{"bip":49,"ext":{"xpriv":"xprv9zZZrtcYB6bg2sxhoVYYKAM8duZHP1MwV1SYNVLStU6qpY6NCKfuTCeeHe1MsBeYDt7XipqZYtshoGC9ghNZ6EVwugKxUPM7m2tFmExu2mt","xpub":"xpub6DYvGQ9S1U9yFN3AuX5YgJHsBwPmnU5nrEN9Ask4SodphLRWjrz9zzy88v6HFPGJuDoMg7hhEG2yFFhU7Djqx3AoE57hEL748iFp26JLXtC"},"int":{"xpriv":"xprv9zZZrtcYB6bg6LXLr8kweVuqCWUTc5dnFDJ526bEyz5pLHdfHRx2D1UPLE8bZy6hK8f1YpXQHeGF2FWEds5S1MSbTH2boaQRNUoz6vy4MRq","xpub":"xpub6DYvGQ9S1U9yJpboxAHx1drZkYJx1YMdcSDfpUzrYKcoD5xopyGGkonsBXbmCnHteYYMcjgWRU7EyByaGf8Mav4y5BTkYmC2TD2JVPmkJxs"},"type":1,"network":{"name":"BITCOIN_TESTNET","type":"testnet","bip":1,"segwit":true,"discovery":"http://92.207.178.198:3001/api","broadcastUrl":"https://chain.so/api/v2/send_tx/BTCTEST","feeApi":"https://api.blockcypher.com/v1/btc/main","connect":{"messagePrefix":"Bitcoin Signed Message:","bech32":"tb","bip32":{"public":70617039,"private":70615956},"pubKeyHash":111,"scriptHash":196,"wif":239}}},"erc20Wallet":""}');
const walletData = JSON.parse('{"$id":3,"id":3,"account_id":1,"name":"Ethereum","displayName":"Ethereum","symbol":"ETH","sdk":"Ethereum","network":"ETHEREUM","internalChainAddressIndex":0,"externalChainAddressIndex":1,"externalAddress":null,"confirmedBalance":10,"unconfirmedBalance":0,"imported":true,"enabled":true,"lastBlockHeight":0,"parentName":"","parentSdk":"","contractAddress":"","decimals":"","hdWallet":{"bip":49,"ext":{"xpriv":"xprv9zZZrtcYB6bg2sxhoVYYKAM8duZHP1MwV1SYNVLStU6qpY6NCKfuTCeeHe1MsBeYDt7XipqZYtshoGC9ghNZ6EVwugKxUPM7m2tFmExu2mt","xpub":"xpub6DYvGQ9S1U9yFN3AuX5YgJHsBwPmnU5nrEN9Ask4SodphLRWjrz9zzy88v6HFPGJuDoMg7hhEG2yFFhU7Djqx3AoE57hEL748iFp26JLXtC"},"int":{"xpriv":"xprv9zZZrtcYB6bg6LXLr8kweVuqCWUTc5dnFDJ526bEyz5pLHdfHRx2D1UPLE8bZy6hK8f1YpXQHeGF2FWEds5S1MSbTH2boaQRNUoz6vy4MRq","xpub":"xpub6DYvGQ9S1U9yJpboxAHx1drZkYJx1YMdcSDfpUzrYKcoD5xopyGGkonsBXbmCnHteYYMcjgWRU7EyByaGf8Mav4y5BTkYmC2TD2JVPmkJxs"},"type":1,"network":{"name":"BITCOIN_TESTNET","type":"testnet","bip":1,"segwit":true,"discovery":"http://92.207.178.198:3001/api","broadcastUrl":"https://chain.so/api/v2/send_tx/BTCTEST","feeApi":"https://api.blockcypher.com/v1/btc/main","connect":{"messagePrefix":"Bitcoin Signed Message:","bech32":"tb","bip32":{"public":70617039,"private":70615956},"pubKeyHash":111,"scriptHash":196,"wif":239}}},"erc20Wallet":""}');
const erc20WalletData = JSON.parse('{"$id":4,"id":4,"account_id":1,"name":"Catalyst","displayName":"Catalyst","symbol":"CAT","sdk":"ERC20","network":"ETHEREUM","internalChainAddressIndex":0,"externalChainAddressIndex":1,"externalAddress":null,"confirmedBalance":5,"unconfirmedBalance":0,"imported":true,"enabled":true,"lastBlockHeight":0,"parentName":"Ethereum","parentSdk":"Ethereum","contractAddress":"123","decimals":"3","hdWallet":{"bip":49,"ext":{"xpriv":"xprv9zZZrtcYB6bg2sxhoVYYKAM8duZHP1MwV1SYNVLStU6qpY6NCKfuTCeeHe1MsBeYDt7XipqZYtshoGC9ghNZ6EVwugKxUPM7m2tFmExu2mt","xpub":"xpub6DYvGQ9S1U9yFN3AuX5YgJHsBwPmnU5nrEN9Ask4SodphLRWjrz9zzy88v6HFPGJuDoMg7hhEG2yFFhU7Djqx3AoE57hEL748iFp26JLXtC"},"int":{"xpriv":"xprv9zZZrtcYB6bg6LXLr8kweVuqCWUTc5dnFDJ526bEyz5pLHdfHRx2D1UPLE8bZy6hK8f1YpXQHeGF2FWEds5S1MSbTH2boaQRNUoz6vy4MRq","xpub":"xpub6DYvGQ9S1U9yJpboxAHx1drZkYJx1YMdcSDfpUzrYKcoD5xopyGGkonsBXbmCnHteYYMcjgWRU7EyByaGf8Mav4y5BTkYmC2TD2JVPmkJxs"},"type":1,"network":{"name":"BITCOIN_TESTNET","type":"testnet","bip":1,"segwit":true,"discovery":"http://92.207.178.198:3001/api","broadcastUrl":"https://chain.so/api/v2/send_tx/BTCTEST","feeApi":"https://api.blockcypher.com/v1/btc/main","connect":{"messagePrefix":"Bitcoin Signed Message:","bech32":"tb","bip32":{"public":70617039,"private":70615956},"pubKeyHash":111,"scriptHash":196,"wif":239}}},"erc20Wallet":""}');

describe('getBalance', () => {
  function storeInit() {
    createStoreMocks();
    Tx.$update = Tx.update;
    Wallet.$update = Wallet.update;
    Wallet.insert({ data: [bitcoinWalletData, walletData] });
    Wallet.insert({ data: erc20WalletData });
    Utxo.insert({ data: utxoData });
    Tx.insert({ data: mockTxs });
  }

  beforeEach(() => {
    jest.clearAllMocks();
    return storeInit();
  });

  it('returns the balance of a bitcoin wallet', () => {
    const balance = GetBalance(bitcoinWalletData, 1);
    expect(balance.confirmed).toBe(1.2);
    expect(balance.unconfirmed).toBe(0.699);
    expect(balance.available).toBe(1);
  });

  it('returns the balance of an Ethereum wallet', () => {
    const balance = GetBalance(walletData, 1);
    expect(balance.confirmed).toBe(10);
    expect(balance.unconfirmed).toBe(4.999);
    expect(balance.available).toBe(4.999);
  });

  it('returns the balance of an Ethereum wallet', () => {
    const balance = GetBalance(erc20WalletData, 1);
    expect(balance.confirmed).toBe(5);
    expect(balance.unconfirmed).toBe(3);
    expect(balance.available).toBe(3);
  });
});
