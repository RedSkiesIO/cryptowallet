import { mount, createWrapper } from '@vue/test-utils';
import SendBitcoin from '@/components/Wallet/SendCoin/SendBitcoin.vue';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';
import Wallet from '@/store/wallet/entities/wallet';
import Coin from '@/store/wallet/entities/coin';
import Address from '@/store/wallet/entities/address';


const walletData = JSON.parse('{"$id":3,"id":3,"account_id":1,"name":"Bitcoin","displayName":"Bitcoin","symbol":"BTC","sdk":"Bitcoin","network":"BITCOIN_TESTNET","internalChainAddressIndex":0,"externalChainAddressIndex":1,"externalAddress":null,"confirmedBalance":0,"unconfirmedBalance":0,"imported":true,"enabled":true,"lastBlockHeight":0,"parentName":"","parentSdk":"","contractAddress":"","decimals":"","hdWallet":{"bip":49,"ext":{"xpriv":"xprv9zZZrtcYB6bg2sxhoVYYKAM8duZHP1MwV1SYNVLStU6qpY6NCKfuTCeeHe1MsBeYDt7XipqZYtshoGC9ghNZ6EVwugKxUPM7m2tFmExu2mt","xpub":"xpub6DYvGQ9S1U9yFN3AuX5YgJHsBwPmnU5nrEN9Ask4SodphLRWjrz9zzy88v6HFPGJuDoMg7hhEG2yFFhU7Djqx3AoE57hEL748iFp26JLXtC"},"int":{"xpriv":"xprv9zZZrtcYB6bg6LXLr8kweVuqCWUTc5dnFDJ526bEyz5pLHdfHRx2D1UPLE8bZy6hK8f1YpXQHeGF2FWEds5S1MSbTH2boaQRNUoz6vy4MRq","xpub":"xpub6DYvGQ9S1U9yJpboxAHx1drZkYJx1YMdcSDfpUzrYKcoD5xopyGGkonsBXbmCnHteYYMcjgWRU7EyByaGf8Mav4y5BTkYmC2TD2JVPmkJxs"},"type":1,"network":{"name":"BITCOIN_TESTNET","type":"testnet","bip":1,"segwit":true,"discovery":"http://92.207.178.198:3001/api","broadcastUrl":"https://chain.so/api/v2/send_tx/BTCTEST","feeApi":"https://api.blockcypher.com/v1/btc/main","connect":{"messagePrefix":"Bitcoin Signed Message:","bech32":"tb","bip32":{"public":70617039,"private":70615956},"pubKeyHash":111,"scriptHash":196,"wif":239}}},"erc20Wallet":""}');
const coinData = JSON.parse('{"$id":"Bitcoin","name":"Bitcoin","displayName":"Bitcoin","minConfirmations":6,"sdk":"Bitcoin","symbol":"BTC","network":"BITCOIN_TESTNET","denomination":"0.00000000","parentName":"","parentSdk":"","contractAddress":"","decimals":""}');
const addressData = JSON.parse('{"$id":1,"id":1,"wallet_id":3,"account_id":1,"address":"2MwSB1utt5aMRp8tY92wNjBpb96UfpDKHX7","index":0,"chain":"external","used":false}');

const coinSDKSMock = {
  'Bitcoin': {
    validateAddress: jest.fn(),
    generateKeyPair: jest.fn().mockReturnValue({ address: '2NGBz7mknbB1GxFSddxa47C3S6qS4FuTnyd' }),
    async createRawTx() {
      return { transaction: { value: 10 } };
    },
  },
};

const activeWalletsMock = {
  1: {
    'Bitcoin': JSON.parse('{"bip":49,"ext":{"xpriv":"xprv9zZZrtcYB6bg2sxhoVYYKAM8duZHP1MwV1SYNVLStU6qpY6NCKfuTCeeHe1MsBeYDt7XipqZYtshoGC9ghNZ6EVwugKxUPM7m2tFmExu2mt","xpub":"xpub6DYvGQ9S1U9yFN3AuX5YgJHsBwPmnU5nrEN9Ask4SodphLRWjrz9zzy88v6HFPGJuDoMg7hhEG2yFFhU7Djqx3AoE57hEL748iFp26JLXtC"},"int":{"xpriv":"xprv9zZZrtcYB6bg6LXLr8kweVuqCWUTc5dnFDJ526bEyz5pLHdfHRx2D1UPLE8bZy6hK8f1YpXQHeGF2FWEds5S1MSbTH2boaQRNUoz6vy4MRq","xpub":"xpub6DYvGQ9S1U9yJpboxAHx1drZkYJx1YMdcSDfpUzrYKcoD5xopyGGkonsBXbmCnHteYYMcjgWRU7EyByaGf8Mav4y5BTkYmC2TD2JVPmkJxs"},"type":1,"network":{"name":"BITCOIN_TESTNET","type":"testnet","bip":1,"segwit":true,"discovery":"http://92.207.178.198:3001/api","broadcastUrl":"https://chain.so/api/v2/send_tx/BTCTEST","feeApi":"https://api.blockcypher.com/v1/btc/main","connect":{"messagePrefix":"Bitcoin Signed Message:","bech32":"tb","bip32":{"public":70617039,"private":70615956},"pubKeyHash":111,"scriptHash":196,"wif":239}}}'),
  },
};

const backEndServiceMock = {
  async getTransactionFee() {
    return JSON.parse('{"data":{"code":"BTC","timestamp":1554218701,"data":{"high":101343,"medium":12000,"low":3000}},"status":200,"statusText":"OK","headers":{"new_refresh_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXZpY2VJZEhhc2giOiIwLjkwNzI4MTQzMzQ1Nzk0MzMiLCJpYXQiOjE1NTQyMTg4NDMsImV4cCI6MTU1Njg5NzI0M30.S1NMyIjT0N8_rVm8xhd5Tb2YuLiU74gRDgqN6Rwg7cY","content-type":"application/json; charset=utf-8"},"config":{"transformRequest":{},"transformResponse":{},"timeout":0,"xsrfCookieName":"XSRF-TOKEN","xsrfHeaderName":"X-XSRF-TOKEN","maxContentLength":-1,"headers":{"Accept":"application/json, text/plain, */*","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXZpY2VJZEhhc2giOiIwLjkwNzI4MTQzMzQ1Nzk0MzMiLCJpYXQiOjE1NTQyMTc1OTMsImV4cCI6MTU1NDIyMTE5M30.CSun95n5-AIxS4r_FnIWz0Y7mumes4tN9bEW7o-OLqs"},"method":"get","url":"http://92.207.178.198:6001/fee-estimate/BTC"},"request":{"__rollbar_xhr":{"method":"GET","url":"http://92.207.178.198:6001/fee-estimate/BTC","status_code":200,"start_time_ms":1554218843339,"end_time_ms":1554218843367,"subtype":"xhr"},"__rollbar_event":{"level":"info","type":"network","timestamp_ms":1554218843366,"body":{"method":"GET","url":"http://92.207.178.198:6001/fee-estimate/BTC","status_code":200,"start_time_ms":1554218843339,"end_time_ms":1554218843367,"subtype":"xhr"},"source":"client"}}}');
  },
};

describe('SendBitcoin component', () => {
  let wrapper;
  let router;
  let store;
  let storeMocks;



  const defaultProps = {};

  function wrapperInit(options) {
    return mount(SendBitcoin, options);
  }

  // 'entities/latestPrice/find'

  function storeInit(custom, propsData) {
    storeMocks = createStoreMocks(custom);
    Wallet.insert({ data: walletData });
    Coin.insert({ data: coinData });
    Address.insert({ data: addressData });

    router = createRouter(storeMocks.store);
    router.push({ path: '/wallet/single/send/3' });
    wrapper = wrapperInit({
      i18n,
      router,
      localVue,
      propsData,
      store: storeMocks.store,
      mocks: {
        coinSDKS: coinSDKSMock,
        activeWallets: activeWalletsMock,
        backEndService: backEndServiceMock,
      },
    });
    store = wrapper.vm.$store;
  }

  beforeEach(() => { storeInit({}, defaultProps); });

  it('renders and matches snapshot', async (done) => {
    setTimeout(() => {
      expect(wrapper.element).toMatchSnapshot();
      done();
    }, 1000);
  });
});
