/* eslint-disable no-magic-numbers */
import { mount } from '@vue/test-utils';
import ConfirmSend from '@/components/Modals/ConfirmSend/ConfirmSendContent.vue';
import ConfirmSendModal from '@/components/Modals/ConfirmSend';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';
import Wallet from '@/store/wallet/entities/wallet';
import Coin from '@/store/wallet/entities/coin';
import Address from '@/store/wallet/entities/address';
import Utxo from '@/store/wallet/entities/utxo';
import LatestPrice from '@/store/latestPrice';
import Tx from '@/store/wallet/entities/tx';

const walletData = JSON.parse('{"$id":3,"id":3,"account_id":1,"name":"Ethereum","displayName":"Ethereum","symbol":"ETH","sdk":"Ethereum","network":"ETHEREUM","internalChainAddressIndex":0,"externalChainAddressIndex":1,"externalAddress":null,"confirmedBalance":10,"unconfirmedBalance":0,"imported":true,"enabled":true,"lastBlockHeight":0,"parentName":"","parentSdk":"","contractAddress":"","decimals":"","hdWallet":{"bip":49,"ext":{"xpriv":"xprv9zZZrtcYB6bg2sxhoVYYKAM8duZHP1MwV1SYNVLStU6qpY6NCKfuTCeeHe1MsBeYDt7XipqZYtshoGC9ghNZ6EVwugKxUPM7m2tFmExu2mt","xpub":"xpub6DYvGQ9S1U9yFN3AuX5YgJHsBwPmnU5nrEN9Ask4SodphLRWjrz9zzy88v6HFPGJuDoMg7hhEG2yFFhU7Djqx3AoE57hEL748iFp26JLXtC"},"int":{"xpriv":"xprv9zZZrtcYB6bg6LXLr8kweVuqCWUTc5dnFDJ526bEyz5pLHdfHRx2D1UPLE8bZy6hK8f1YpXQHeGF2FWEds5S1MSbTH2boaQRNUoz6vy4MRq","xpub":"xpub6DYvGQ9S1U9yJpboxAHx1drZkYJx1YMdcSDfpUzrYKcoD5xopyGGkonsBXbmCnHteYYMcjgWRU7EyByaGf8Mav4y5BTkYmC2TD2JVPmkJxs"},"type":1,"network":{"name":"BITCOIN_TESTNET","type":"testnet","bip":1,"segwit":true,"discovery":"http://92.207.178.198:3001/api","broadcastUrl":"https://chain.so/api/v2/send_tx/BTCTEST","feeApi":"https://api.blockcypher.com/v1/btc/main","connect":{"messagePrefix":"Bitcoin Signed Message:","bech32":"tb","bip32":{"public":70617039,"private":70615956},"pubKeyHash":111,"scriptHash":196,"wif":239}}},"erc20Wallet":""}');
const erc20WalletData = JSON.parse('{"$id":4,"id":4,"account_id":1,"name":"Catalyst","displayName":"Catalyst","symbol":"CAT","sdk":"ERC20","network":"ETHEREUM","internalChainAddressIndex":0,"externalChainAddressIndex":1,"externalAddress":null,"confirmedBalance":0,"unconfirmedBalance":0,"imported":true,"enabled":true,"lastBlockHeight":0,"parentName":"Ethereum","parentSdk":"Ethereum","contractAddress":"123","decimals":"3","hdWallet":{"bip":49,"ext":{"xpriv":"xprv9zZZrtcYB6bg2sxhoVYYKAM8duZHP1MwV1SYNVLStU6qpY6NCKfuTCeeHe1MsBeYDt7XipqZYtshoGC9ghNZ6EVwugKxUPM7m2tFmExu2mt","xpub":"xpub6DYvGQ9S1U9yFN3AuX5YgJHsBwPmnU5nrEN9Ask4SodphLRWjrz9zzy88v6HFPGJuDoMg7hhEG2yFFhU7Djqx3AoE57hEL748iFp26JLXtC"},"int":{"xpriv":"xprv9zZZrtcYB6bg6LXLr8kweVuqCWUTc5dnFDJ526bEyz5pLHdfHRx2D1UPLE8bZy6hK8f1YpXQHeGF2FWEds5S1MSbTH2boaQRNUoz6vy4MRq","xpub":"xpub6DYvGQ9S1U9yJpboxAHx1drZkYJx1YMdcSDfpUzrYKcoD5xopyGGkonsBXbmCnHteYYMcjgWRU7EyByaGf8Mav4y5BTkYmC2TD2JVPmkJxs"},"type":1,"network":{"name":"BITCOIN_TESTNET","type":"testnet","bip":1,"segwit":true,"discovery":"http://92.207.178.198:3001/api","broadcastUrl":"https://chain.so/api/v2/send_tx/BTCTEST","feeApi":"https://api.blockcypher.com/v1/btc/main","connect":{"messagePrefix":"Bitcoin Signed Message:","bech32":"tb","bip32":{"public":70617039,"private":70615956},"pubKeyHash":111,"scriptHash":196,"wif":239}}},"erc20Wallet":""}');
const bitcoinWalletData = JSON.parse('{"$id":5,"id":5,"account_id":1,"name":"Bitcoin","displayName":"Bitcoin","symbol":"BTC","sdk":"Bitcoin","network":"BITCOIN_TESTNET","internalChainAddressIndex":0,"externalChainAddressIndex":1,"externalAddress":null,"confirmedBalance":-10,"unconfirmedBalance":-10,"imported":true,"enabled":true,"lastBlockHeight":0,"parentName":"","parentSdk":"","contractAddress":"","decimals":"","hdWallet":{"bip":49,"ext":{"xpriv":"xprv9zZZrtcYB6bg2sxhoVYYKAM8duZHP1MwV1SYNVLStU6qpY6NCKfuTCeeHe1MsBeYDt7XipqZYtshoGC9ghNZ6EVwugKxUPM7m2tFmExu2mt","xpub":"xpub6DYvGQ9S1U9yFN3AuX5YgJHsBwPmnU5nrEN9Ask4SodphLRWjrz9zzy88v6HFPGJuDoMg7hhEG2yFFhU7Djqx3AoE57hEL748iFp26JLXtC"},"int":{"xpriv":"xprv9zZZrtcYB6bg6LXLr8kweVuqCWUTc5dnFDJ526bEyz5pLHdfHRx2D1UPLE8bZy6hK8f1YpXQHeGF2FWEds5S1MSbTH2boaQRNUoz6vy4MRq","xpub":"xpub6DYvGQ9S1U9yJpboxAHx1drZkYJx1YMdcSDfpUzrYKcoD5xopyGGkonsBXbmCnHteYYMcjgWRU7EyByaGf8Mav4y5BTkYmC2TD2JVPmkJxs"},"type":1,"network":{"name":"BITCOIN_TESTNET","type":"testnet","bip":1,"segwit":true,"discovery":"http://92.207.178.198:3001/api","broadcastUrl":"https://chain.so/api/v2/send_tx/BTCTEST","feeApi":"https://api.blockcypher.com/v1/btc/main","connect":{"messagePrefix":"Bitcoin Signed Message:","bech32":"tb","bip32":{"public":70617039,"private":70615956},"pubKeyHash":111,"scriptHash":196,"wif":239}}},"erc20Wallet":""}');

const coinData = JSON.parse('{"$id":"Ethereum","name":"Ethereum","displayName":"Ethereum","minConfirmations":11,"sdk":"Ethereum","symbol":"ETH","network":"ETHEREUM_ROPSTEN","denomination":"0.000000000","parentName":"","parentSdk":"","contractAddress":"","decimals":""}');
const erc20CoinData = JSON.parse('{"$id":"Catalyst","name":"Catalyst","displayName":"Catalyst","minConfirmations":11,"sdk":"ERC20","symbol":"CAT","network":"ETHEREUM_ROPSTEN","denomination":"0.000","parentName":"Ethereum","parentSdk":"Ethereum","contractAddress":"123","decimals":"4"}');
const bitcoinCoinData = JSON.parse('{"$id":"Bitcoin","name":"Bitcoin","displayName":"Bitcoin","minConfirmations":6,"sdk":"Bitcoin","symbol":"BTC","network":"BITCOIN_TESTNET","denomination":"0.00000000","parentName":"","parentSdk":"","contractAddress":"","decimals":""}');

const addressData = JSON.parse('{"$id":1,"id":1,"wallet_id":3,"account_id":1,"address":"2MwSB1utt5aMRp8tY92wNjBpb96UfpDKHX7","index":0,"chain":"external","used":false}');
const utxoData = JSON.parse('{"$id":1,"id":1,"account_id":1,"wallet_id":5,"pending":false,"address":"2MwSB1utt5aMRp8tY92wNjBpb96UfpDKHX7","amount":10,"scriptPubKey":"a9142df2990ee914d0a0c0dc8ed92abe91642d7a415b87","txid":"9e792178e63be3d05b7f03f822c060909bd9fa5c451ce4ab11c1827108c5fb6d","value":271750,"vout":0}');
const latestPriceData = JSON.parse('{"$id":"ETH_GBP","coin":"ETH","currency":"GBP","updated":1554305869988,"data":{"VOLUME24HOURTO":10147125.523436274,"PRICE":3818.12,"CHANGEPCT24HOUR":4.734003741558176}}');

const customStore = {
  state: {
    modals: {
      sendConfirmTxData: {
        transaction: {
          receiver: ['123'],
          value: 1,
          fee: 0.01,
        },
        utxo: [utxoData],
        changeAddresses: ['789'],
      },
    },
  },
};

const coinSDKSMock = {
  Bitcoin: {
    broadcastTx: jest.fn().mockImplementation(() => {
      return {
        result: true,
      };
    }),
  },
  Ethereum: {
    broadcastTx: jest.fn().mockImplementation(() => {
      return {
        result: true,
      };
    }),
  },
  ERC20: {
    broadcastTx: jest.fn(),
  },
};

const backEndServiceMock = {
  async getTransactionFee() {
    return JSON.parse('{"data":{"code":"ETH","timestamp":1554218701,"data":{"high":11281690855,"medium":11281690855,"low":11281690855}},"status":200,"statusText":"OK","headers":{"new_refresh_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXZpY2VJZEhhc2giOiIwLjkwNzI4MTQzMzQ1Nzk0MzMiLCJpYXQiOjE1NTQyMTg4NDMsImV4cCI6MTU1Njg5NzI0M30.S1NMyIjT0N8_rVm8xhd5Tb2YuLiU74gRDgqN6Rwg7cY","content-type":"application/json; charset=utf-8"},"config":{"transformRequest":{},"transformResponse":{},"timeout":0,"xsrfCookieName":"XSRF-TOKEN","xsrfHeaderName":"X-XSRF-TOKEN","maxContentLength":-1,"headers":{"Accept":"application/json, text/plain, */*","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXZpY2VJZEhhc2giOiIwLjkwNzI4MTQzMzQ1Nzk0MzMiLCJpYXQiOjE1NTQyMTc1OTMsImV4cCI6MTU1NDIyMTE5M30.CSun95n5-AIxS4r_FnIWz0Y7mumes4tN9bEW7o-OLqs"},"method":"get","url":"http://92.207.178.198:6001/fee-estimate/BTC"},"request":{"__rollbar_xhr":{"method":"GET","url":"http://92.207.178.198:6001/fee-estimate/BTC","status_code":200,"start_time_ms":1554218843339,"end_time_ms":1554218843367,"subtype":"xhr"},"__rollbar_event":{"level":"info","type":"network","timestamp_ms":1554218843366,"body":{"method":"GET","url":"http://92.207.178.198:6001/fee-estimate/BTC","status_code":200,"start_time_ms":1554218843339,"end_time_ms":1554218843367,"subtype":"xhr"},"source":"client"}}}');
  },
  loadPriceFeed: jest.fn(),
};

describe('ConfirmSend component', () => {
  let wrapper;
  let router;
  let storeMocks;

  const defaultProps = {};

  function wrapperInit(options) {
    return mount(ConfirmSend, options);
  }

  function storeInit(custom, propsData, id = 3) {
    storeMocks = createStoreMocks(custom);
    Wallet.insert({ data: [walletData, bitcoinWalletData, erc20WalletData] });
    Coin.insert({ data: [coinData, bitcoinCoinData, erc20CoinData] });
    Address.insert({ data: addressData });
    Utxo.insert({ data: utxoData });
    LatestPrice.insert({ data: latestPriceData });
    router = createRouter(storeMocks.store);
    router.push({ path: `/wallet/single/send/${id}` });
    wrapper = wrapperInit({
      i18n,
      router,
      localVue,
      propsData,
      store: storeMocks.store,
      parentComponent: ConfirmSendModal,
      mocks: {
        coinSDKS: coinSDKSMock,
        backEndService: backEndServiceMock,
        errorHandler: jest.fn(),
      },
    });
  }

  it('renders and matches snapshot', () => {
    storeInit({}, defaultProps);
    expect(wrapper.element).toMatchSnapshot();
  });

  it('displays an ethereum transaction', async (done) => {
    storeInit(customStore);
    setTimeout(() => {
      expect(wrapper.text()).toMatch('123');
      expect(wrapper.text()).toMatch('1 ETH');
      expect(wrapper.text()).toMatch('0.01 ETH');
      expect(wrapper.vm.to).toEqual('123');
      expect(wrapper.vm.txData.transaction.value).toEqual(1);
      expect(wrapper.vm.txData.transaction.fee).toEqual(0.01);
      done();
    }, 25);
  });

  it('displays a bitcoin transaction', async (done) => {
    storeInit(customStore, {}, 5);
    setTimeout(() => {
      expect(wrapper.text()).toMatch('123');
      expect(wrapper.text()).toMatch('1 BTC');
      expect(wrapper.text()).toMatch('0.01 BTC');
      expect(wrapper.vm.to).toEqual('123');
      expect(wrapper.vm.txData.transaction.value).toEqual(1);
      expect(wrapper.vm.txData.transaction.fee).toEqual(0.01);
      done();
    }, 100);
  });

  it('displays an erc20 transaction', async (done) => {
    customStore.state.modals.sendConfirmTxData.transaction.fee = 10000000000000;
    customStore.state.modals.sendConfirmTxData.transaction.receiver = '456';
    storeInit(customStore, {}, 4);
    setTimeout(() => {
      expect(wrapper.text()).toMatch('456');
      expect(wrapper.text()).toMatch('1 CAT');
      expect(wrapper.text()).toMatch('0.00001 ETH');
      expect(wrapper.vm.to).toEqual('456');
      expect(wrapper.vm.txData.transaction.value).toEqual(1);
      expect(wrapper.vm.txData.transaction.fee).toEqual(10000000000000);
      done();
    }, 100);
  });

  it('closes the modal when the back button is clicked', async (done) => {
    storeInit(customStore);
    router.push({ path: '/wallet/' });
    router.push({ path: '/wallet/single/send/3' });
    setTimeout(() => {
      wrapper.findAll('button').at(0).trigger('click');
      setTimeout(() => {
        expect(storeMocks.actions.setConfirmSendModalOpened).toHaveBeenCalled();
        done();
      }, 25);
    }, 25);
  });

  describe('broadcastTx', () => {
    it('adds a successful ethereum transaction to the database and opens the sendSuccess modal', async (done) => {
      customStore.state.modals.sendConfirmTxData.transaction.fee = 0.01;
      customStore.state.modals.sendConfirmTxData.transaction.receiver = '123';
      storeInit(customStore);
      wrapper.findAll('button').at(1).trigger('click');
      setTimeout(() => {
        expect(Tx.all()[0].wallet_id).toEqual(3);
        expect(storeMocks.actions.setSendSuccessModalOpened).toHaveBeenCalled();
        done();
      }, 100);
    });

    it('opens the sendFailure modal if an ethereum transaction fails', async (done) => {
      coinSDKSMock.Ethereum.broadcastTx.mockImplementationOnce(() => {
        return undefined;
      });
      storeInit(customStore);
      wrapper.findAll('button').at(1).trigger('click');
      setTimeout(() => {
        done();
      }, 100);
    });

    it('adds a successful bitcoin transaction to the database and opens the sendSuccess modal', async (done) => {
      storeInit(customStore, {}, 5);
      wrapper.findAll('button').at(1).trigger('click');
      setTimeout(() => {
        expect(Tx.all()[0].wallet_id).toEqual(5);
        expect(Address.all()[1].wallet_id).toEqual(5);
        expect(storeMocks.actions.setSendSuccessModalOpened).toHaveBeenCalled();
        done();
      }, 100);
    });

    it('opens the sendFailure modal if a bitcoin transaction fails', async (done) => {
      coinSDKSMock.Bitcoin.broadcastTx.mockImplementationOnce(() => {
        return undefined;
      });
      storeInit(customStore, {}, 5);
      wrapper.findAll('button').at(1).trigger('click');
      setTimeout(() => {
        done();
      }, 100);
    });
  });

  describe('parent modal', () => {
    it('opens and closes the modal', () => {
      wrapper.vm.$parent.$store = wrapper.vm.$store;
      wrapper.vm.$parent.sendConfirmModalOpened = false;
      expect(wrapper.vm.$parent.sendConfirmModalOpened).toBe(false);
      expect(storeMocks.actions.setConfirmSendModalOpened.mock.calls[1][1]).toBe(false);
      wrapper.vm.$parent.sendConfirmModalOpened = true;
      expect(storeMocks.actions.setConfirmSendModalOpened.mock.calls[2][1]).toBe(true);
    });
  });
});
