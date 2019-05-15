/* eslint-disable no-magic-numbers */
import { mount } from '@vue/test-utils';
import Header from '@/layouts/Header';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';
import Wallet from '@/store/wallet/entities/wallet';
import LatestPrice from '@/store/latestPrice';

describe('Header.vue', () => {
  let storeMocks;
  let wrapper;
  let router;

  const walletData = JSON.parse('{"$id":3,"id":3,"account_id":1,"name":"Ethereum","displayName":"Ethereum","symbol":"ETH","sdk":"Ethereum","network":"ETHEREUM","internalChainAddressIndex":0,"externalChainAddressIndex":1,"externalAddress":null,"confirmedBalance":10,"unconfirmedBalance":0,"imported":true,"enabled":true,"lastBlockHeight":0,"parentName":"","parentSdk":"","contractAddress":"","decimals":"","hdWallet":{"bip":49,"ext":{"xpriv":"xprv9zZZrtcYB6bg2sxhoVYYKAM8duZHP1MwV1SYNVLStU6qpY6NCKfuTCeeHe1MsBeYDt7XipqZYtshoGC9ghNZ6EVwugKxUPM7m2tFmExu2mt","xpub":"xpub6DYvGQ9S1U9yFN3AuX5YgJHsBwPmnU5nrEN9Ask4SodphLRWjrz9zzy88v6HFPGJuDoMg7hhEG2yFFhU7Djqx3AoE57hEL748iFp26JLXtC"},"int":{"xpriv":"xprv9zZZrtcYB6bg6LXLr8kweVuqCWUTc5dnFDJ526bEyz5pLHdfHRx2D1UPLE8bZy6hK8f1YpXQHeGF2FWEds5S1MSbTH2boaQRNUoz6vy4MRq","xpub":"xpub6DYvGQ9S1U9yJpboxAHx1drZkYJx1YMdcSDfpUzrYKcoD5xopyGGkonsBXbmCnHteYYMcjgWRU7EyByaGf8Mav4y5BTkYmC2TD2JVPmkJxs"},"type":1,"network":{"name":"BITCOIN_TESTNET","type":"testnet","bip":1,"segwit":true,"discovery":"http://92.207.178.198:3001/api","broadcastUrl":"https://chain.so/api/v2/send_tx/BTCTEST","feeApi":"https://api.blockcypher.com/v1/btc/main","connect":{"messagePrefix":"Bitcoin Signed Message:","bech32":"tb","bip32":{"public":70617039,"private":70615956},"pubKeyHash":111,"scriptHash":196,"wif":239}}},"erc20Wallet":""}');
  const erc20WalletData = JSON.parse('{"$id":4,"id":4,"account_id":1,"name":"Catalyst","displayName":"Catalyst","symbol":"CAT","sdk":"ERC20","network":"ETHEREUM","internalChainAddressIndex":0,"externalChainAddressIndex":1,"externalAddress":null,"confirmedBalance":10,"unconfirmedBalance":0,"imported":true,"enabled":true,"lastBlockHeight":0,"parentName":"Ethereum","parentSdk":"Ethereum","contractAddress":"123","decimals":"3","hdWallet":{"bip":49,"ext":{"xpriv":"xprv9zZZrtcYB6bg2sxhoVYYKAM8duZHP1MwV1SYNVLStU6qpY6NCKfuTCeeHe1MsBeYDt7XipqZYtshoGC9ghNZ6EVwugKxUPM7m2tFmExu2mt","xpub":"xpub6DYvGQ9S1U9yFN3AuX5YgJHsBwPmnU5nrEN9Ask4SodphLRWjrz9zzy88v6HFPGJuDoMg7hhEG2yFFhU7Djqx3AoE57hEL748iFp26JLXtC"},"int":{"xpriv":"xprv9zZZrtcYB6bg6LXLr8kweVuqCWUTc5dnFDJ526bEyz5pLHdfHRx2D1UPLE8bZy6hK8f1YpXQHeGF2FWEds5S1MSbTH2boaQRNUoz6vy4MRq","xpub":"xpub6DYvGQ9S1U9yJpboxAHx1drZkYJx1YMdcSDfpUzrYKcoD5xopyGGkonsBXbmCnHteYYMcjgWRU7EyByaGf8Mav4y5BTkYmC2TD2JVPmkJxs"},"type":1,"network":{"name":"BITCOIN_TESTNET","type":"testnet","bip":1,"segwit":true,"discovery":"http://92.207.178.198:3001/api","broadcastUrl":"https://chain.so/api/v2/send_tx/BTCTEST","feeApi":"https://api.blockcypher.com/v1/btc/main","connect":{"messagePrefix":"Bitcoin Signed Message:","bech32":"tb","bip32":{"public":70617039,"private":70615956},"pubKeyHash":111,"scriptHash":196,"wif":239}}},"erc20Wallet":""}');
  const latestPriceData = JSON.parse('{"$id":"ETH_GBP","coin":"ETH","currency":"GBP","updated":1554305869988,"data":{"VOLUME24HOURTO":10147125.523436274,"PRICE":3818.12,"CHANGEPCT24HOUR":4.734003741558176}}');

  function wrapperInit(options) {
    return mount(Header, options);
  }

  function storeInit(custom, route = '/') {
    storeMocks = createStoreMocks(custom);
    Wallet.$insert({ data: [walletData, erc20WalletData] });
    LatestPrice.$insert({ data: latestPriceData });
    router = createRouter(storeMocks.store);
    router.push({ path: route });
    wrapper = wrapperInit({
      i18n, router, localVue, store: storeMocks.store,
    });
  }

  beforeEach(() => { return storeInit(); });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('it renders a section with .header-section class', () => {
    expect(wrapper.contains('section.header-section')).toBe(true);
  });

  it('renders a h1 element with .header-h1 class and the wallet name within it', () => {
    expect(wrapper.contains('h1.header-h1')).toBe(true);
    expect(wrapper.find('h1.header-h1').html().includes('CryptoWallet')).toBe(true);
  });

  it('renders a "Go Back" button', () => {
    expect(wrapper.find('button').text()).toBe('arrow_back');
  });

  it('calls a goBack method on the "Go Back" button click', (done) => {
    router.push({ path: '/fake/' });
    wrapper.find('button').trigger('click');
    setTimeout(() => {
      expect(router.history.current.path).toBe('/');
      done();
    }, 500);
  });

  it('switches the "Go Back" button disabled state based on the window.history length', () => {
    expect(wrapper.contains('button.disabled')).toBe(true);
    router.push({ path: '/fake/' });
    expect(wrapper.contains('button.disabled')).toBe(false);
  });

  it('displays a select account button if on /', () => {
    expect(wrapper.findAll('button').at(1).text()).toBe('people');
  });

  it('displays an add wallet button if on /wallet', () => {
    router.push({ path: '/wallet' });
    expect(wrapper.findAll('button').at(1).text()).toBe('add');
  });

  it('displays a price chart button if on walletSingle or sendCoinSingle and wallet has price data', (done) => {
    storeInit({}, '/wallet/single/3');
    setTimeout(() => {
      expect(wrapper.findAll('button').at(1).text()).toBe('timeline');
      done();
    }, 0);
  });

  it('goes to price chart screen when price chart button is clicked', (done) => {
    storeInit({}, '/wallet/single/3');
    wrapper.findAll('button').at(1).trigger('click');
    setTimeout(() => {
      expect(router.history.current.path).toBe('/wallet/single/prices/3');
      done();
    }, 0);
  });

  it('calls setSelectAccountModalOpened action on account button click', (done) => {
    wrapper.findAll('button').at(1).trigger('click');
    setTimeout(() => {
      expect(storeMocks.actions.setSelectAccountModalOpened.mock.calls[0][1]).toEqual(true);
      done();
    }, 0);
  });

  it('calls setAddwalletModalOpened action on add wallet button click', (done) => {
    router.push({ path: '/wallet' });
    wrapper.findAll('button').at(1).trigger('click');
    setTimeout(() => {
      expect(storeMocks.actions.setAddWalletModalOpened.mock.calls[0][1]).toEqual(true);
      done();
    }, 0);
  });

  it('hides the header if on /setup/0', () => {
    router.push({ path: '/setup/0' });
    expect(wrapper.contains('section.header-section')).toBe(false);
  });

  it('displays a generic coin logo on header if logo is found', () => {
    storeInit({}, '/wallet/single/4');
    expect(wrapper.contains('img[src="./statics/cc-icons/color/generic.svg"]')).toBe(true);
  });

  it('changes heading title based on route name', () => {
    router.push({ path: '/setup/1' });
    expect(wrapper.find('h1.header-h1').text().includes('')).toBe(true);
    router.push({ path: '/settings' });
    expect(wrapper.find('h1.header-h1').text().includes(wrapper.vm.$t('settings'))).toBe(true);
    router.push({ path: '/exchange' });
    expect(wrapper.find('h1.header-h1').text().includes(wrapper.vm.$t('exchange'))).toBe(true);
  });
});
