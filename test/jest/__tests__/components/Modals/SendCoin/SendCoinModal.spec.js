/* eslint-disable no-magic-numbers */
import { shallowMount } from '@vue/test-utils';
import SendCoinModal from '@/components/Modals/SendCoin';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';
import Wallet from '@/store/wallet/entities/wallet';

describe('SendCoinModal.vue', () => {
  let storeMocks;
  let wrapper;
  let router;

  const walletData = JSON.parse('{"$id":3,"id":3,"account_id":1,"name":"Bitcoin","displayName":"Bitcoin","symbol":"BTC","sdk":"Bitcoin","network":"BITCOIN_TESTNET","internalChainAddressIndex":23,"externalChainAddressIndex":15,"externalAddress":"2NGBz7mknbB1GxFSddxa47C3S6qS4FuTnyd","confirmedBalance":0.52543197,"unconfirmedBalance":0,"imported":false,"enabled":false,"lastBlockHeight":0,"parentName":"","parentSdk":"","contractAddress":"","decimals":"","hdWallet":{"bip":49,"ext":{"xpriv":"xprv9ztbaJYMADTpxd5o1wyCqJAfnBjbLvSqWsqgk2HKSgDsi4BQPBf5PdJ4XLPZd4ugHQ9o45sExCuJuWBnxyu61Gt7fVj1kAPoB1hsze1XNAC","xpub":"xpub6Dswyp5Ezb28B7AG7yWDCS7QLDa5kPAgt6mHYQgw11krarWYviyKwRcYNbeutQRsNtQn1DD9SnaXHMpwpzAEDnBxvZZrDFQ2ehUGw8kxH6u"},"int":{"xpriv":"xprv9ztbaJYMADTpzuEkRPVdJkHNUmdBg98S2VUv91asoQzVTZtHsavn9SYuxy4iYwjpLZrmNy4oUJQoS6fGUJBMvT7Kfm3uvw1Q9b3DhJY23i5","xpub":"xpub6Dswyp5Ezb28DPKDXR2dftE72oTg5brHPiQWwPzVMkXULNDSR8F2hEsPpEZKhymsboomxhqiwmnvec5FTc36WuFWSGPtjQrL6YrQ6JWSBnh"},"type":1,"network":{"name":"BITCOIN_TESTNET","type":"testnet","bip":1,"segwit":true,"discovery":"http://92.207.178.198:3001/api","broadcastUrl":"https://chain.so/api/v2/send_tx/BTCTEST","feeApi":"https://api.blockcypher.com/v1/btc/main","connect":{"messagePrefix":"0018Bitcoin Signed Message:","bech32":"tb","bip32":{"public":70617039,"private":70615956},"pubKeyHash":111,"scriptHash":196,"wif":239}}},"erc20Wallet":""}');


  function wrapperInit(options) {
    return shallowMount(SendCoinModal, options);
  }

  function storeInit(custom) {
    storeMocks = createStoreMocks(custom);
    Wallet.insert({ data: [walletData] });
    router = createRouter(storeMocks.store);
    router.push({ path: '/wallet/prices/1' });
    wrapper = wrapperInit({
      i18n, router, localVue, store: storeMocks.store,
    });
  }

  beforeEach(() => { return storeInit(); });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('opens and closes modal on route change', () => {
    wrapper.vm.sendCoinModalOpened = true;
    router.push({ path: '/wallet' });
    expect(storeMocks.actions.setSendCoinModalOpened.mock.calls[1][1]).toBe(false);
    router.push({ path: '/wallet/single/Send/1' });
    expect(storeMocks.actions.setSendCoinModalOpened.mock.calls[2][1]).toBe(true);
  });

  it('goes to previous route when modal is closed', (done) => {
    wrapper.vm.$store.state.modals.sendCoinModalOpened = true;
    router.push({ path: '/wallet' });
    router.push({ path: '/wallet/single/send/1' });
    wrapper.vm.$store.state.modals.sendCoinModalOpened = false;
    setTimeout(() => {
      expect(router.history.current.path).toBe('/wallet');
      wrapper.vm.$store.state.modals.sendCoinModalOpened = true;
      wrapper.vm.$store.state.modals.sendCoinModalOpened = false;
      wrapper.vm.goBack();
      done();
    }, 500);
  });
});
