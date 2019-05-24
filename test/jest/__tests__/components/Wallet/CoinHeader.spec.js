import { mount } from '@vue/test-utils';
import CoinHeader from '@/components/Wallet/CoinHeader';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';
import Coin from '@/store/wallet/entities/coin';
import Wallet from '@/store/wallet/entities/wallet';
import LatestPrice from '@/store/latestPrice';

describe('CoinHeader.vue', () => {
  let storeMocks;
  let wrapper;
  let router;

  const erc20CoinData = JSON.parse('{"$id":"Catalyst","name":"Catalyst","displayName":"Catalyst","minConfirmations":11,"sdk":"ERC20","symbol":"CAT","network":"ETHEREUM_ROPSTEN","denomination":"0.000","parentName":"Ethereum","parentSdk":"Ethereum","contractAddress":"123","decimals":"4"}');
  const erc20WalletData = JSON.parse('{"$id":1,"id":1,"account_id":1,"name":"Catalyst","displayName":"Catalyst","symbol":"CAT","sdk":"ERC20","network":"ETHEREUM","internalChainAddressIndex":0,"externalChainAddressIndex":1,"externalAddress":null,"confirmedBalance":10,"unconfirmedBalance":0,"imported":true,"enabled":true,"lastBlockHeight":0,"parentName":"Ethereum","parentSdk":"Ethereum","contractAddress":"123","decimals":"3","hdWallet":{"bip":49,"ext":{"xpriv":"xprv9zZZrtcYB6bg2sxhoVYYKAM8duZHP1MwV1SYNVLStU6qpY6NCKfuTCeeHe1MsBeYDt7XipqZYtshoGC9ghNZ6EVwugKxUPM7m2tFmExu2mt","xpub":"xpub6DYvGQ9S1U9yFN3AuX5YgJHsBwPmnU5nrEN9Ask4SodphLRWjrz9zzy88v6HFPGJuDoMg7hhEG2yFFhU7Djqx3AoE57hEL748iFp26JLXtC"},"int":{"xpriv":"xprv9zZZrtcYB6bg6LXLr8kweVuqCWUTc5dnFDJ526bEyz5pLHdfHRx2D1UPLE8bZy6hK8f1YpXQHeGF2FWEds5S1MSbTH2boaQRNUoz6vy4MRq","xpub":"xpub6DYvGQ9S1U9yJpboxAHx1drZkYJx1YMdcSDfpUzrYKcoD5xopyGGkonsBXbmCnHteYYMcjgWRU7EyByaGf8Mav4y5BTkYmC2TD2JVPmkJxs"},"type":1,"network":{"name":"BITCOIN_TESTNET","type":"testnet","bip":1,"segwit":true,"discovery":"http://92.207.178.198:3001/api","broadcastUrl":"https://chain.so/api/v2/send_tx/BTCTEST","feeApi":"https://api.blockcypher.com/v1/btc/main","connect":{"messagePrefix":"Bitcoin Signed Message:","bech32":"tb","bip32":{"public":70617039,"private":70615956},"pubKeyHash":111,"scriptHash":196,"wif":239}}},"erc20Wallet":""}');
  const walletData = JSON.parse('{"$id":3,"id":3,"account_id":1,"name":"Ethereum","displayName":"Ethereum","symbol":"ETH","sdk":"Ethereum","network":"ETHEREUM","internalChainAddressIndex":0,"externalChainAddressIndex":1,"externalAddress":null,"confirmedBalance":10,"unconfirmedBalance":0,"imported":true,"enabled":true,"lastBlockHeight":0,"parentName":"","parentSdk":"","contractAddress":"","decimals":"","hdWallet":{"bip":49,"ext":{"xpriv":"xprv9zZZrtcYB6bg2sxhoVYYKAM8duZHP1MwV1SYNVLStU6qpY6NCKfuTCeeHe1MsBeYDt7XipqZYtshoGC9ghNZ6EVwugKxUPM7m2tFmExu2mt","xpub":"xpub6DYvGQ9S1U9yFN3AuX5YgJHsBwPmnU5nrEN9Ask4SodphLRWjrz9zzy88v6HFPGJuDoMg7hhEG2yFFhU7Djqx3AoE57hEL748iFp26JLXtC"},"int":{"xpriv":"xprv9zZZrtcYB6bg6LXLr8kweVuqCWUTc5dnFDJ526bEyz5pLHdfHRx2D1UPLE8bZy6hK8f1YpXQHeGF2FWEds5S1MSbTH2boaQRNUoz6vy4MRq","xpub":"xpub6DYvGQ9S1U9yJpboxAHx1drZkYJx1YMdcSDfpUzrYKcoD5xopyGGkonsBXbmCnHteYYMcjgWRU7EyByaGf8Mav4y5BTkYmC2TD2JVPmkJxs"},"type":1,"network":{"name":"BITCOIN_TESTNET","type":"testnet","bip":1,"segwit":true,"discovery":"http://92.207.178.198:3001/api","broadcastUrl":"https://chain.so/api/v2/send_tx/BTCTEST","feeApi":"https://api.blockcypher.com/v1/btc/main","connect":{"messagePrefix":"Bitcoin Signed Message:","bech32":"tb","bip32":{"public":70617039,"private":70615956},"pubKeyHash":111,"scriptHash":196,"wif":239}}},"erc20Wallet":""}');
  const coinData = JSON.parse('{"$id":"Ethereum","name":"Ethereum","displayName":"Ethereum","minConfirmations":11,"sdk":"Ethereum","symbol":"ETH","network":"ETHEREUM_ROPSTEN","denomination":"0.000000000","parentName":"","parentSdk":"","contractAddress":"","decimals":""}');
  const latestPriceData = JSON.parse('{"$id":"ETH_GBP","coin":"ETH","currency":"GBP","updated":1554305869988,"data":{"VOLUME24HOURTO":10147125.523436274,"PRICE":3818.12,"CHANGEPCT24HOUR":4.734003741558176}}');


  const mockGetBalance = jest.fn().mockImplementation(() => {
    return {
      unconfirmed: 0,
      available: 0,
    };
  });

  let propsData = {
    wallet: {
      id: 1,
      name: 'Catalyst',
      displayName: 'Catalyst',
      parentName: 'Ethereum',
      symbol: 'CAT',
      network: 'ETHEREUM_ROPSTEN',
      sdk: 'ERC20',
      confirmedBalance: 10,
    },
    simple: true,
  };

  function wrapperInit(options) {
    return mount(CoinHeader, options);
  }

  function storeInit(custom) {
    storeMocks = createStoreMocks(custom);
    Coin.insert({ data: [coinData, erc20CoinData] });
    Wallet.insert({ data: [walletData, erc20WalletData] });
    LatestPrice.insert({ data: latestPriceData });
    router = createRouter(storeMocks.store);
    router.push({ path: '/' });
    wrapper = wrapperInit({
      i18n,
      router,
      localVue,
      store: storeMocks.store,
      propsData,
      mocks: { getBalance: mockGetBalance },
    });
  }

  beforeEach(() => { return storeInit(); });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('displays the balance', () => {
    expect(wrapper.text()).toMatch('10 CAT');
  });

  it('displays the coin logo', () => {
    expect(wrapper.contains('img[src="./statics/cc-icons/color/generic.svg"]')).toBe(true);
    propsData = {
      wallet: {
        id: 1,
        name: 'Ethereum',
        displayName: 'Ethereum',
        parentName: 'Ethereum',
        symbol: 'ETH',
        network: 'ETHEREUM_ROPSTEN',
        sdk: 'Ethereum',
        confirmedBalance: 10,
      },
      simple: true,
    };
    storeInit();
    expect(wrapper.contains('img[src="./statics/cc-icons/color/eth.svg"]')).toBe(true);
  });

  it('renders send and receive buttons if simple prop is true', () => {
    expect(wrapper.findAll('button').length).toBe(2);
  });

  it('routes to /wallet/single/send when the send button is clicked', () => {
    wrapper.findAll('button').at(0).trigger('click');
    expect(router.history.current.path).toBe('/wallet/single/send/1');
  });

  it('routes to /wallet/single/receive when the receive button is clicked', () => {
    wrapper.findAll('button').at(1).trigger('click');
    expect(router.history.current.path).toBe('/wallet/single/receive/1');
  });
});
