/* eslint-disable no-magic-numbers */
import { mount } from '@vue/test-utils';
import SendEtehreum from '@/components/Wallet/SendCoin/SendEtehreum.vue';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';
import Wallet from '@/store/wallet/entities/wallet';
import Coin from '@/store/wallet/entities/coin';
import Address from '@/store/wallet/entities/address';
import Utxo from '@/store/wallet/entities/utxo';
import LatestPrice from '@/store/latestPrice';
import cordovaMocks from '~/test/CordovaMocks';

const walletData = JSON.parse('{"$id":3,"id":3,"account_id":1,"name":"Ethereum","displayName":"Ethereum","symbol":"ETH","sdk":"Ethereum","network":"ETHEREUM","internalChainAddressIndex":0,"externalChainAddressIndex":1,"externalAddress":null,"confirmedBalance":10,"unconfirmedBalance":0,"imported":true,"enabled":true,"lastBlockHeight":0,"parentName":"","parentSdk":"","contractAddress":"","decimals":"","hdWallet":{"bip":49,"ext":{"xpriv":"xprv9zZZrtcYB6bg2sxhoVYYKAM8duZHP1MwV1SYNVLStU6qpY6NCKfuTCeeHe1MsBeYDt7XipqZYtshoGC9ghNZ6EVwugKxUPM7m2tFmExu2mt","xpub":"xpub6DYvGQ9S1U9yFN3AuX5YgJHsBwPmnU5nrEN9Ask4SodphLRWjrz9zzy88v6HFPGJuDoMg7hhEG2yFFhU7Djqx3AoE57hEL748iFp26JLXtC"},"int":{"xpriv":"xprv9zZZrtcYB6bg6LXLr8kweVuqCWUTc5dnFDJ526bEyz5pLHdfHRx2D1UPLE8bZy6hK8f1YpXQHeGF2FWEds5S1MSbTH2boaQRNUoz6vy4MRq","xpub":"xpub6DYvGQ9S1U9yJpboxAHx1drZkYJx1YMdcSDfpUzrYKcoD5xopyGGkonsBXbmCnHteYYMcjgWRU7EyByaGf8Mav4y5BTkYmC2TD2JVPmkJxs"},"type":1,"network":{"name":"BITCOIN_TESTNET","type":"testnet","bip":1,"segwit":true,"discovery":"http://92.207.178.198:3001/api","broadcastUrl":"https://chain.so/api/v2/send_tx/BTCTEST","feeApi":"https://api.blockcypher.com/v1/btc/main","connect":{"messagePrefix":"Bitcoin Signed Message:","bech32":"tb","bip32":{"public":70617039,"private":70615956},"pubKeyHash":111,"scriptHash":196,"wif":239}}},"erc20Wallet":""}');
const erc20WalletData = JSON.parse('{"$id":4,"id":4,"account_id":1,"name":"Catalyst","displayName":"Catalyst","symbol":"CAT","sdk":"ERC20","network":"ETHEREUM","internalChainAddressIndex":0,"externalChainAddressIndex":1,"externalAddress":null,"confirmedBalance":10,"unconfirmedBalance":0,"imported":true,"enabled":true,"lastBlockHeight":0,"parentName":"Ethereum","parentSdk":"Ethereum","contractAddress":"123","decimals":"3","hdWallet":{"bip":49,"ext":{"xpriv":"xprv9zZZrtcYB6bg2sxhoVYYKAM8duZHP1MwV1SYNVLStU6qpY6NCKfuTCeeHe1MsBeYDt7XipqZYtshoGC9ghNZ6EVwugKxUPM7m2tFmExu2mt","xpub":"xpub6DYvGQ9S1U9yFN3AuX5YgJHsBwPmnU5nrEN9Ask4SodphLRWjrz9zzy88v6HFPGJuDoMg7hhEG2yFFhU7Djqx3AoE57hEL748iFp26JLXtC"},"int":{"xpriv":"xprv9zZZrtcYB6bg6LXLr8kweVuqCWUTc5dnFDJ526bEyz5pLHdfHRx2D1UPLE8bZy6hK8f1YpXQHeGF2FWEds5S1MSbTH2boaQRNUoz6vy4MRq","xpub":"xpub6DYvGQ9S1U9yJpboxAHx1drZkYJx1YMdcSDfpUzrYKcoD5xopyGGkonsBXbmCnHteYYMcjgWRU7EyByaGf8Mav4y5BTkYmC2TD2JVPmkJxs"},"type":1,"network":{"name":"BITCOIN_TESTNET","type":"testnet","bip":1,"segwit":true,"discovery":"http://92.207.178.198:3001/api","broadcastUrl":"https://chain.so/api/v2/send_tx/BTCTEST","feeApi":"https://api.blockcypher.com/v1/btc/main","connect":{"messagePrefix":"Bitcoin Signed Message:","bech32":"tb","bip32":{"public":70617039,"private":70615956},"pubKeyHash":111,"scriptHash":196,"wif":239}}},"erc20Wallet":""}');
const coinData = JSON.parse('{"$id":"Ethereum","name":"Ethereum","displayName":"Ethereum","minConfirmations":11,"sdk":"Ethereum","symbol":"ETH","network":"ETHEREUM_ROPSTEN","denomination":"0.000000000","parentName":"","parentSdk":"","contractAddress":"","decimals":""}');
const erc20CoinData = JSON.parse('{"$id":"Catalyst","name":"Catalyst","displayName":"Catalyst","minConfirmations":11,"sdk":"ERC20","symbol":"CAT","network":"ETHEREUM_ROPSTEN","denomination":"0.000","parentName":"Ethereum","parentSdk":"Ethereum","contractAddress":"123","decimals":"4"}');
const addressData = JSON.parse('{"$id":1,"id":1,"wallet_id":3,"account_id":1,"address":"2MwSB1utt5aMRp8tY92wNjBpb96UfpDKHX7","index":0,"chain":"external","used":false}');
const utxoData = JSON.parse('{"$id":1,"id":1,"account_id":1,"wallet_id":3,"pending":false,"address":"2MwSB1utt5aMRp8tY92wNjBpb96UfpDKHX7","amount":0.0027175,"scriptPubKey":"a9142df2990ee914d0a0c0dc8ed92abe91642d7a415b87","txid":"9e792178e63be3d05b7f03f822c060909bd9fa5c451ce4ab11c1827108c5fb6d","value":271750,"vout":0}');
const latestPriceData = JSON.parse('{"$id":"ETH_GBP","coin":"ETH","currency":"GBP","updated":1554305869988,"data":{"VOLUME24HOURTO":10147125.523436274,"PRICE":3818.12,"CHANGEPCT24HOUR":4.734003741558176}}');

const coinSDKSMock = {
  Ethereum: {
    validateAddress: jest.fn().mockReturnValue(false),
    generateKeyPair: jest.fn().mockReturnValue({ address: '2NGBz7mknbB1GxFSddxa47C3S6qS4FuTnyd' }),
    async createEthTx() {
      return {
        transaction: {
          value: 10,
          fee: 0.00002292,
        },
        hexTx: '01000000000101b40e427611c0eead720b813d4dd2884c24ceccc49821663ea2b9f550490909ff01000000171600149fcebc74505da311ed8b28e36036945e2fc38282ffffffff02a6fe01000000000017a9148540dfedbf1bda7c1a8e29b28f7b914bd8e128cc87eacd7c000000000017a9146fdbb9c720eb4482235279dab579a80e71080fd1870247304402202c8d14b4745bde39cac8fd5cadbe49a637f9d63ba1e7a69cb9e06a69933b93bc022021dfee161715504f9fa1087da66bf13ef6ceed8c7e465fa5f457a21215634f58012103a5f8746a824a6a197bfe6fdc47e3de574abf0ebe0debddf0795945fde2c3a20800000000',
      };
    },
  },
  ERC20: {
    validateAddress: jest.fn().mockReturnValue(false),
    generateKeyPair: jest.fn().mockReturnValue({ address: '2NGBz7mknbB1GxFSddxa47C3S6qS4FuTnyd' }),
    async transfer() {
      return {
        transaction: {
          value: 10,
          fee: 0.00002292,
        },
        hexTx: '01000000000101b40e427611c0eead720b813d4dd2884c24ceccc49821663ea2b9f550490909ff01000000171600149fcebc74505da311ed8b28e36036945e2fc38282ffffffff02a6fe01000000000017a9148540dfedbf1bda7c1a8e29b28f7b914bd8e128cc87eacd7c000000000017a9146fdbb9c720eb4482235279dab579a80e71080fd1870247304402202c8d14b4745bde39cac8fd5cadbe49a637f9d63ba1e7a69cb9e06a69933b93bc022021dfee161715504f9fa1087da66bf13ef6ceed8c7e465fa5f457a21215634f58012103a5f8746a824a6a197bfe6fdc47e3de574abf0ebe0debddf0795945fde2c3a20800000000',
      };
    },
    estimateGas: jest.fn().mockReturnValue(25000),
  },
};

const activeWalletsMock = {
  1: {
    Ethereum: JSON.parse('{"bip":49,"ext":{"xpriv":"xprv9zZZrtcYB6bg2sxhoVYYKAM8duZHP1MwV1SYNVLStU6qpY6NCKfuTCeeHe1MsBeYDt7XipqZYtshoGC9ghNZ6EVwugKxUPM7m2tFmExu2mt","xpub":"xpub6DYvGQ9S1U9yFN3AuX5YgJHsBwPmnU5nrEN9Ask4SodphLRWjrz9zzy88v6HFPGJuDoMg7hhEG2yFFhU7Djqx3AoE57hEL748iFp26JLXtC"},"int":{"xpriv":"xprv9zZZrtcYB6bg6LXLr8kweVuqCWUTc5dnFDJ526bEyz5pLHdfHRx2D1UPLE8bZy6hK8f1YpXQHeGF2FWEds5S1MSbTH2boaQRNUoz6vy4MRq","xpub":"xpub6DYvGQ9S1U9yJpboxAHx1drZkYJx1YMdcSDfpUzrYKcoD5xopyGGkonsBXbmCnHteYYMcjgWRU7EyByaGf8Mav4y5BTkYmC2TD2JVPmkJxs"},"type":1,"network":{"name":"BITCOIN_TESTNET","type":"testnet","bip":1,"segwit":true,"discovery":"http://92.207.178.198:3001/api","broadcastUrl":"https://chain.so/api/v2/send_tx/BTCTEST","feeApi":"https://api.blockcypher.com/v1/btc/main","connect":{"messagePrefix":"Bitcoin Signed Message:","bech32":"tb","bip32":{"public":70617039,"private":70615956},"pubKeyHash":111,"scriptHash":196,"wif":239}}}'),
    Catalyst: JSON.parse('{"bip":49,"ext":{"xpriv":"xprv9zZZrtcYB6bg2sxhoVYYKAM8duZHP1MwV1SYNVLStU6qpY6NCKfuTCeeHe1MsBeYDt7XipqZYtshoGC9ghNZ6EVwugKxUPM7m2tFmExu2mt","xpub":"xpub6DYvGQ9S1U9yFN3AuX5YgJHsBwPmnU5nrEN9Ask4SodphLRWjrz9zzy88v6HFPGJuDoMg7hhEG2yFFhU7Djqx3AoE57hEL748iFp26JLXtC"},"int":{"xpriv":"xprv9zZZrtcYB6bg6LXLr8kweVuqCWUTc5dnFDJ526bEyz5pLHdfHRx2D1UPLE8bZy6hK8f1YpXQHeGF2FWEds5S1MSbTH2boaQRNUoz6vy4MRq","xpub":"xpub6DYvGQ9S1U9yJpboxAHx1drZkYJx1YMdcSDfpUzrYKcoD5xopyGGkonsBXbmCnHteYYMcjgWRU7EyByaGf8Mav4y5BTkYmC2TD2JVPmkJxs"},"type":1,"network":{"name":"BITCOIN_TESTNET","type":"testnet","bip":1,"segwit":true,"discovery":"http://92.207.178.198:3001/api","broadcastUrl":"https://chain.so/api/v2/send_tx/BTCTEST","feeApi":"https://api.blockcypher.com/v1/btc/main","connect":{"messagePrefix":"Bitcoin Signed Message:","bech32":"tb","bip32":{"public":70617039,"private":70615956},"pubKeyHash":111,"scriptHash":196,"wif":239}}}'),

  },
};

const backEndServiceMock = {
  async getTransactionFee() {
    return JSON.parse('{"data":{"code":"ETH","timestamp":1554218701,"data":{"high":11281690855,"medium":11281690855,"low":11281690855}},"status":200,"statusText":"OK","headers":{"new_refresh_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXZpY2VJZEhhc2giOiIwLjkwNzI4MTQzMzQ1Nzk0MzMiLCJpYXQiOjE1NTQyMTg4NDMsImV4cCI6MTU1Njg5NzI0M30.S1NMyIjT0N8_rVm8xhd5Tb2YuLiU74gRDgqN6Rwg7cY","content-type":"application/json; charset=utf-8"},"config":{"transformRequest":{},"transformResponse":{},"timeout":0,"xsrfCookieName":"XSRF-TOKEN","xsrfHeaderName":"X-XSRF-TOKEN","maxContentLength":-1,"headers":{"Accept":"application/json, text/plain, */*","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXZpY2VJZEhhc2giOiIwLjkwNzI4MTQzMzQ1Nzk0MzMiLCJpYXQiOjE1NTQyMTc1OTMsImV4cCI6MTU1NDIyMTE5M30.CSun95n5-AIxS4r_FnIWz0Y7mumes4tN9bEW7o-OLqs"},"method":"get","url":"http://92.207.178.198:6001/fee-estimate/BTC"},"request":{"__rollbar_xhr":{"method":"GET","url":"http://92.207.178.198:6001/fee-estimate/BTC","status_code":200,"start_time_ms":1554218843339,"end_time_ms":1554218843367,"subtype":"xhr"},"__rollbar_event":{"level":"info","type":"network","timestamp_ms":1554218843366,"body":{"method":"GET","url":"http://92.207.178.198:6001/fee-estimate/BTC","status_code":200,"start_time_ms":1554218843339,"end_time_ms":1554218843367,"subtype":"xhr"},"source":"client"}}}');
  },
  loadPriceFeed: jest.fn(),
};

describe('SendEthereum component', () => {
  let wrapper;
  let router;
  let storeMocks;

  const defaultProps = {};

  function wrapperInit(options) {
    return mount(SendEtehreum, options);
  }

  function storeInit(custom, propsData, id = 3) {
    storeMocks = createStoreMocks(custom);
    Wallet.insert({ data: walletData });
    Wallet.insert({ data: erc20WalletData });
    Coin.insert({ data: coinData });
    Coin.insert({ data: erc20CoinData });
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
      mocks: {
        coinSDKS: coinSDKSMock,
        activeWallets: activeWalletsMock,
        backEndService: backEndServiceMock,
        errorHandler: jest.fn(),
      },
      sync: false,
    });
  }

  beforeEach(() => {
    cordovaMocks.initMocks();
    storeInit({}, defaultProps);
  });

  afterEach(() => { cordovaMocks.destroyMocks(); });

  it('renders and matches snapshot', async (done) => {
    setTimeout(() => {
      expect(wrapper.element).toMatchSnapshot();
      done();
    }, 25);
  });

  describe('Recipient section', () => {
    describe('paste', () => {
      it('pastes the address if paste button is clicked', () => {
        cordova.plugins.clipboard.mockBehaviour = 1;
        wrapper.find('.paste-btn').trigger('click');
        expect(wrapper.vm.address).toBe('pasted text');
      });

      it('passes the error into errorHandler if paste misbehaves', () => {
        cordova.plugins.clipboard.mockBehaviour = 2;
        wrapper.find('.paste-btn').trigger('click');
        expect(wrapper.vm.errorHandler).toHaveBeenCalledTimes(1);
      });
    });

    describe('QRScanner', () => {
      it('opens the QR code scanner when code icon is clicked', async (done) => {
        QRScanner.mockBehaviour = 2;
        wrapper.find('.qr-code-wrapper').trigger('click');
        expect(storeMocks.actions.scanQRCode).toHaveBeenCalled();
        expect(storeMocks.actions.setSendCoinModalOpened).toHaveBeenCalled();
        expect(storeMocks.actions.setSendCoinModalOpened.mock.calls[0][1]).toBe(false);
        done();
      });

      it('passes the error to the errorHandler if QRScanner fails', async (done) => {
        QRScanner.mockBehaviour = 0;
        wrapper.find('.qr-code-wrapper').trigger('click');

        setTimeout(() => {
          expect(wrapper.vm.errorHandler).toHaveBeenCalledTimes(1);
          done();
        }, 1000);
      });

      it('does nothing if scanned qrcode contains invalid address', async (done) => {
        QRScanner.mockBehaviour = 1;
        wrapper.find('.qr-code-wrapper').trigger('click');
        wrapper.vm.$toast.create = jest.fn();

        setTimeout(() => {
          expect(storeMocks.actions.setScannedAddress.mock.calls.length).toBe(0);
          expect(storeMocks.actions.cancelScanning.mock.calls.length).toBe(0);
          done();
        }, 1000);
      });

      it('dispatches correct actions', async (done) => {
        coinSDKSMock.Ethereum.validateAddress = jest.fn().mockReturnValue(true);
        QRScanner.mockBehaviour = 2;
        wrapper.find('.qr-code-wrapper').trigger('click');

        setTimeout(() => {
          expect(storeMocks.actions.setScannedAddress).toHaveBeenCalled();
          expect(storeMocks.actions.setScannedAddress.mock.calls[0][1]).toBe('2NCQfWAPZ2bCWNhsVWvu9retMFBnfk8sWZE');
          expect(storeMocks.actions.cancelScanning).toHaveBeenCalled();
          expect(storeMocks.actions.setSendCoinModalOpened).toHaveBeenCalled();
          expect(storeMocks.actions.setSendCoinModalOpened.mock.calls[0][1]).toBe(false);
          done();
        }, 700);
      });

      it('does nothing if device doesn\'t have a camera', async (done) => {
        QRScanner = undefined;
        wrapper.find('.qr-code-wrapper').trigger('click');

        setTimeout(() => {
          expect(storeMocks.state.sendCoinModalOpened).toBe(false);
          done();
        }, 1000);
      });
    });

    describe('address input', () => {
      it('recognizes invalid and valid address if you input into the field', (done) => {
        coinSDKSMock.Ethereum.validateAddress = jest.fn().mockReturnValue(false);
        const input = wrapper.find('.address-input input');
        input.trigger('focus');
        input.element.value = '123';
        input.trigger('input');

        setTimeout(() => {
          expect(wrapper.contains('.address-input.q-field--error')).toBe(true);
          expect(wrapper.find('.error-label-address').text()).toBe(wrapper.vm.$t('ethereumAddressInvalidLength'));

          coinSDKSMock.Ethereum.validateAddress = jest.fn().mockReturnValue(false);
          input.element.value = '1xaE6A186f7FF18BA137Cf6D8e760B0F4821C90DDE';
          input.trigger('input');
          setTimeout(() => {
            expect(wrapper.contains('.address-input.q-field--error')).toBe(true);
            expect(wrapper.find('.error-label-address').text()).toBe(wrapper.vm.$t('ethereumAddressInvalid'));

            coinSDKSMock.Ethereum.validateAddress = jest.fn().mockReturnValue(true);
            input.element.value = '0xaE6A186f7FF18BA137Cf6D8e760B0F4821C90DDE';
            input.trigger('input');
            setTimeout(() => {
              expect(wrapper.contains('.address-input.q-field--error')).toBe(false);
              expect(wrapper.find('.error-label-address').text()).toBe('');
              done();
            }, 100);
          }, 100);
        }, 100);
      });
    });
  });

  describe('Amount section', () => {
    describe('amount inputs', () => {
      it('also populates the amount in FIAT currency when only amount in coin is entered', (done) => {
        const inputInCoin = wrapper.find('.amount-in-coin input');
        wrapper.find('.amount-in-coin').trigger('focus');
        inputInCoin.element.value = 0.001;
        inputInCoin.trigger('input');

        setTimeout(() => {
          const inputInCurrency = wrapper.find('.amount-in-currency input');
          expect(inputInCurrency.element.value).toBe('3.82');
          done();
        }, 0);
      });

      it('also populates the amount in coin when only amount in FIAT currency is entered', (done) => {
        const inputInCurrency = wrapper.find('.amount-in-currency input');
        wrapper.find('.amount-in-currency').trigger('focus');
        inputInCurrency.element.value = 10;
        inputInCurrency.trigger('input');

        setTimeout(() => {
          const inputInCoin = wrapper.find('.amount-in-coin input');
          expect(inputInCoin.element.value).toBe('0.00261909');
          done();
        }, 0);
      });

      it('validates the amount in coin input on blur events', (done) => {
        wrapper.find('.amount-in-coin').trigger('blur');
        setTimeout(() => {
          expect(wrapper.contains('.amount-in-coin.q-field--error')).toBe(true);
          expect(wrapper.find('.error-label-amount').text()).toBe(wrapper.vm.$t('noAmount'));
          done();
        }, 0);
      });

      it('validates the amount in currency input on blur events', (done) => {
        wrapper.find('.amount-in-currency').trigger('blur');
        setTimeout(() => {
          expect(wrapper.contains('.amount-in-currency.q-field--error')).toBe(true);
          expect(wrapper.find('.error-label-amount').text()).toBe(wrapper.vm.$t('noAmount'));
          done();
        }, 0);
      });

      it('resets the state of in coin input when in currency input is emptied', (done) => {
        const inputInCoin = wrapper.find('.amount-in-coin input');
        wrapper.find('.amount-in-coin').trigger('focus');
        inputInCoin.element.value = 1;
        inputInCoin.trigger('input');
        wrapper.vm.updateInCoinFocus(false);

        setTimeout(() => {
          expect(wrapper.vm.inCurrency).toBeTruthy();
          inputInCoin.element.value = '';
          inputInCoin.trigger('input');
          setTimeout(() => {
            expect(wrapper.vm.inCurrency).toBe('');
            done();
          }, 0);
        }, 0);
      });

      it('resets the state of in currency input when in coin input is emptied', (done) => {
        const inputInCurrency = wrapper.find('.amount-in-currency input');
        wrapper.find('.amount-in-currency').trigger('focus');
        inputInCurrency.element.value = 10;
        inputInCurrency.trigger('input');
        wrapper.vm.updateInCurrencyFocus(false);

        setTimeout(() => {
          expect(wrapper.vm.inCoin).toBeTruthy();
          inputInCurrency.element.value = '';
          inputInCurrency.trigger('input');

          setTimeout(() => {
            expect(wrapper.vm.inCoin).toBe('');
            done();
          }, 0);
        }, 0);
      });

      it('invalidates amount if user tries to input more than available funds', (done) => {
        const inputInCoin = wrapper.find('.amount-in-coin input');
        wrapper.find('.amount-in-coin').trigger('focus');
        inputInCoin.element.value = 99999;
        inputInCoin.trigger('input');
        setTimeout(() => {
          expect(wrapper.find('.error-label-amount').text()).toBe(wrapper.vm.$t('notEnoughFunds'));
          done();
        }, 0);
      });

      it('validates the number of decimal places in the ETH amount', (done) => {
        const inputInCoin = wrapper.find('.amount-in-coin input');
        wrapper.find('.amount-in-coin').trigger('focus');
        inputInCoin.element.value = '0.0111111111111111122222222';
        inputInCoin.trigger('input');
        wrapper.find('.amount-in-currency').trigger('focus');
        setTimeout(() => {
          wrapper.find('.amount-in-coin').trigger('blur');
          setTimeout(() => {
            expect(inputInCoin.element.value).toEqual('0.011111111');
            done();
          }, 50);
        }, 50);
      });

      it('validates the number of decimal places in an ERC20 amount', (done) => {
        storeInit({}, defaultProps, 4);
        const inputInCoin = wrapper.find('.amount-in-coin input');
        wrapper.find('.amount-in-coin').trigger('focus');
        inputInCoin.element.value = '0.0111111111111111122222222';
        inputInCoin.trigger('input');
        wrapper.vm.updateInCoinFocus(false);
        setTimeout(() => {
          wrapper.find('.amount-in-coin').trigger('blur');
          setTimeout(() => {
            expect(inputInCoin.element.value).toEqual('0.01');
            done();
          }, 50);
        }, 50);
      });
    });

    describe('Max button', () => {
      it('calculates the max amount when clicked and resets the inputs if clicked a second time', (done) => {
        wrapper.find('.max-button').trigger('click');
        const inputInCoin = wrapper.find('.amount-in-coin input');
        const inputInCurrency = wrapper.find('.amount-in-currency input');

        setTimeout(() => {
          expect(inputInCoin.element.value).toBe('10');
          expect(inputInCurrency.element.value).toBe('38181.20');
          wrapper.find('.max-button').trigger('click');

          setTimeout(() => {
            expect(inputInCoin.element.value).toBe('');
            expect(inputInCurrency.element.value).toBe('');
            expect(wrapper.vm.estimatedFee).toBe(wrapper.vm.$t('N/A'));
            done();
          }, 25);
        }, 25);
      });
    });
  });

  describe('Fee section', () => {
    it('updates fee label when setting changes', (done) => {
      expect(wrapper.find('.q-slider__pin-value-marker-text').text()).toBe(wrapper.vm.$t('mediumFeeLabel'));
      wrapper.vm.feeSetting = 0;
      wrapper.vm.feeChange(0);
      setTimeout(() => {
        expect(wrapper.find('.q-slider__pin-value-marker-text').text()).toBe(wrapper.vm.$t('lowFeeLabel'));

        wrapper.vm.feeSetting = 2;
        wrapper.vm.feeChange(2);
        setTimeout(() => {
          expect(wrapper.find('.q-slider__pin-value-marker-text').text()).toBe(wrapper.vm.$t('highFeeLabel'));
          done();
        }, 25);
      }, 25);
    });

    it('displays the fee in ETH for ERC20 tokens', (done) => {
      storeInit({}, defaultProps, 4);
      wrapper.vm.address = '0xaE6A186f7FF18BA137Cf6D8e760B0F4821C90DDE';
      wrapper.vm.inCoin = 5;
      const fees = {
        low: 11281690855,
        medium: 11281690855,
        high: 11281690855,
      };
      wrapper.vm.feeSetting = 0;
      wrapper.vm.feeChange(0);

      setTimeout(() => {
        expect(wrapper.vm.feeData.low).toEqual(fees.low);
        expect(wrapper.vm.feeData.medium).toEqual(fees.medium);
        expect(wrapper.vm.feeData.high).toEqual(fees.high);
        done();
      }, 25);
    });

    it('updates the estimatedFee if the amount is maxed', async (done) => {
      wrapper.find('.max-button').trigger('click');
      setTimeout(() => {
        wrapper.vm.feeSetting = 2;
        wrapper.vm.feeChange(2);

        setTimeout(() => {
          expect(wrapper.vm.estimatedFee).toBe('0.000237 ETH (£0.90)');
          done();
        }, 750);
      }, 25);
    });

    it('displays that the fee is n/a if device is offline', async (done) => {
      global.navigator = { onLine: false };
      setTimeout(() => {
        wrapper.vm.feeSetting = 2;
        wrapper.vm.feeChange(2);

        setTimeout(() => {
          expect(wrapper.vm.estimatedFee).toBe('N/A');
          done();
        }, 750);
      }, 25);
    });
  });

  describe('Send button', () => {
    it('validates required inputs when clicked', async (done) => {
      wrapper.vm.$toast.create = jest.fn();
      wrapper.find('.send-btn').trigger('click');
      setTimeout(() => {
        expect(wrapper.vm.$toast.create).toHaveBeenCalledWith(10, wrapper.vm.$t('fillAllInputs'), 500);

        wrapper.vm.address = '123';
        wrapper.vm.$toast.create = jest.fn();
        wrapper.find('.send-btn').trigger('click');
        setTimeout(() => {
          expect(wrapper.vm.$toast.create).toHaveBeenCalledWith(10, wrapper.vm.$t('fillAllInputs'), 500);
          done();
        }, 25);
      }, 25);
    });

    it('checks if provided address is valid', async (done) => {
      wrapper.vm.$toast.create = jest.fn();
      const input = wrapper.find('.address-input input');
      input.trigger('focus');
      input.element.value = '123';
      input.trigger('input');

      wrapper.vm.inCoin = 0.01;

      wrapper.find('.send-btn').trigger('click');
      setTimeout(() => {
        expect(wrapper.vm.$toast.create).toHaveBeenCalledWith(10, wrapper.vm.$t('ethereumAddressInvalidLength'), 500);
        done();
      }, 25);
    });

    it('check if provided amount is valid', async (done) => {
      wrapper.vm.$toast.create = jest.fn();
      wrapper.vm.address = '2NCQfWAPZ2bCWNhsVWvu9retMFBnfk8sWZE';

      const inputInCoin = wrapper.find('.amount-in-coin input');
      wrapper.find('.amount-in-coin').trigger('focus');
      inputInCoin.element.value = 9999;
      inputInCoin.trigger('input');

      setTimeout(() => {
        wrapper.find('.send-btn').trigger('click');
        setTimeout(() => {
          expect(wrapper.vm.$toast.create).toHaveBeenCalledWith(10, wrapper.vm.$t('notEnoughFunds'), 500);
          done();
        }, 25);
      }, 25);
    });

    it('it dispatches correct actions with correct payloads if passed all the checks', async (done) => {
      wrapper.vm.$toast.create = jest.fn();
      wrapper.vm.address = '0xaE6A186f7FF18BA137Cf6D8e760B0F4821C90DDEE';

      const inputInCoin = wrapper.find('.amount-in-coin input');
      wrapper.find('.amount-in-coin').trigger('focus');
      inputInCoin.element.value = 0.001;
      inputInCoin.trigger('input');

      setTimeout(() => {
        wrapper.find('.send-btn').trigger('click');
        setTimeout(() => {
          expect(storeMocks.actions.setConfirmSendModalOpened.mock.calls[0][1]).toBe(true);
          const txData = storeMocks.actions.setConfirmTransactionData.mock.calls[0][1];
          expect(txData.hexTx).toBeTruthy();
          expect(txData.transaction).toBeTruthy();
          done();
        }, 25);
      }, 25);
    });

    it('it dispatches correct actions with correct payloads if passed all the checks for ERC20 tokens', async (done) => {
      storeInit({}, defaultProps, 4);
      wrapper.vm.address = '0xaE6A186f7FF18BA137Cf6D8e760B0F4821C90DDEE';
      const inputInCoin = wrapper.find('.amount-in-coin input');
      wrapper.find('.amount-in-coin').trigger('focus');
      inputInCoin.element.value = 0.001;
      inputInCoin.trigger('input');
      setTimeout(() => {
        wrapper.find('.send-btn').trigger('click');
        setTimeout(() => {
          expect(storeMocks.actions.setConfirmSendModalOpened.mock.calls[0][1]).toBe(true);
          const txData = storeMocks.actions.setConfirmTransactionData.mock.calls[0][1];
          expect(txData.hexTx).toBeTruthy();
          expect(txData.transaction).toBeTruthy();
          done();
        }, 25);
      }, 25);
    });
  });

  describe('Other', () => {
    it('passes the error to the errorHandler if async method coinSDK.createEthTX fails', async (done) => {
      coinSDKSMock.Ethereum.createEthTx = async function createEthTx() {
        throw new Error('test error');
      };

      wrapper.vm.address = '0xaE6A186f7FF18BA137Cf6D8e760B0F4821C90DDEE';
      const inputInCoin = wrapper.find('.amount-in-coin input');
      wrapper.find('.amount-in-coin').trigger('focus');
      inputInCoin.element.value = 0.001;
      inputInCoin.trigger('input');
      setTimeout(() => {
        wrapper.find('.send-btn').trigger('click');

        setTimeout(() => {
          expect(wrapper.vm.errorHandler).toHaveBeenCalled();
          coinSDKSMock.Ethereum.createEthTx = async function createEthTx() {
            return { transaction: { value: 10, fee: 0.00002292 } };
          };
          done();
        }, 25);
      }, 25);
    });

    it('passes the error to the errorHandler if async method coinSDK.transfer fails', async (done) => {
      storeInit({}, defaultProps, 4);
      coinSDKSMock.ERC20.transfer = async function transfer() {
        throw new Error('test error');
      };
      wrapper.vm.address = '0xaE6A186f7FF18BA137Cf6D8e760B0F4821C90DDEE';
      const inputInCoin = wrapper.find('.amount-in-coin input');
      wrapper.find('.amount-in-coin').trigger('focus');
      inputInCoin.element.value = 0.001;
      inputInCoin.trigger('input');
      setTimeout(() => {
        wrapper.find('.send-btn').trigger('click');

        setTimeout(() => {
          expect(wrapper.vm.errorHandler).toHaveBeenCalled();
          coinSDKSMock.ERC20.transfer = async function transfer() {
            return { transaction: { value: 10, fee: 0.00002292 } };
          };
          done();
        }, 25);
      }, 25);
    });


    it('uses scanned QRCode address if available', async (done) => {
      const custom = {
        state: {
          qrcode: {
            scannedAddress: 'scannedString',
          },
        },
        mutations: {},
        getters: {},
        actions: {},
      };

      storeInit(custom, defaultProps);
      setTimeout(() => {
        expect(wrapper.vm.address).toBe(custom.state.qrcode.scannedAddress);
        done();
      }, 25);
    });
  });
});
