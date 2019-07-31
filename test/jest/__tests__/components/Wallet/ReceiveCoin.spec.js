/* eslint-disable no-magic-numbers */
import ReceiveCoin from '@/components/Wallet/ReceiveCoin';
import { mount, config } from '@vue/test-utils';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';
import Wallet from '@/store/wallet/entities/wallet';
import Coin from '@/store/wallet/entities/coin';
import cordovaMocks from '~/test/CordovaMocks';
import QRCode from 'qrcode';

describe('ReceiveCoin component', () => {
  let wrapper;
  let router;
  let storeMocks;
  let qrContent;

  const walletData = JSON.parse('{"$id":3,"id":3,"account_id":1,"name":"Bitcoin","displayName":"Bitcoin","symbol":"BTC","sdk":"Bitcoin","network":"BITCOIN_TESTNET","internalChainAddressIndex":23,"externalChainAddressIndex":15,"externalAddress":"2NGBz7mknbB1GxFSddxa47C3S6qS4FuTnyd","confirmedBalance":0.52543197,"unconfirmedBalance":0,"imported":false,"enabled":false,"lastBlockHeight":0,"parentName":"","parentSdk":"","contractAddress":"","decimals":"","hdWallet":{"bip":49,"ext":{"xpriv":"xprv9ztbaJYMADTpxd5o1wyCqJAfnBjbLvSqWsqgk2HKSgDsi4BQPBf5PdJ4XLPZd4ugHQ9o45sExCuJuWBnxyu61Gt7fVj1kAPoB1hsze1XNAC","xpub":"xpub6Dswyp5Ezb28B7AG7yWDCS7QLDa5kPAgt6mHYQgw11krarWYviyKwRcYNbeutQRsNtQn1DD9SnaXHMpwpzAEDnBxvZZrDFQ2ehUGw8kxH6u"},"int":{"xpriv":"xprv9ztbaJYMADTpzuEkRPVdJkHNUmdBg98S2VUv91asoQzVTZtHsavn9SYuxy4iYwjpLZrmNy4oUJQoS6fGUJBMvT7Kfm3uvw1Q9b3DhJY23i5","xpub":"xpub6Dswyp5Ezb28DPKDXR2dftE72oTg5brHPiQWwPzVMkXULNDSR8F2hEsPpEZKhymsboomxhqiwmnvec5FTc36WuFWSGPtjQrL6YrQ6JWSBnh"},"type":1,"network":{"name":"BITCOIN_TESTNET","type":"testnet","bip":1,"segwit":true,"discovery":"http://92.207.178.198:3001/api","broadcastUrl":"https://chain.so/api/v2/send_tx/BTCTEST","feeApi":"https://api.blockcypher.com/v1/btc/main","connect":{"messagePrefix":"0018Bitcoin Signed Message:","bech32":"tb","bip32":{"public":70617039,"private":70615956},"pubKeyHash":111,"scriptHash":196,"wif":239}}},"erc20Wallet":""}');
  const walletData2 = JSON.parse('{"$id":4,"id":4,"account_id":1,"name":"Bitcoin","displayName":"Bitcoin","symbol":"BTC","sdk":"Bitcoin","network":"BITCOIN_TESTNET","internalChainAddressIndex":23,"externalChainAddressIndex":15,"externalAddress":null,"confirmedBalance":0.52543197,"unconfirmedBalance":0,"imported":false,"enabled":false,"lastBlockHeight":0,"parentName":"","parentSdk":"","contractAddress":"","decimals":"","hdWallet":{"bip":49,"ext":{"xpriv":"xprv9ztbaJYMADTpxd5o1wyCqJAfnBjbLvSqWsqgk2HKSgDsi4BQPBf5PdJ4XLPZd4ugHQ9o45sExCuJuWBnxyu61Gt7fVj1kAPoB1hsze1XNAC","xpub":"xpub6Dswyp5Ezb28B7AG7yWDCS7QLDa5kPAgt6mHYQgw11krarWYviyKwRcYNbeutQRsNtQn1DD9SnaXHMpwpzAEDnBxvZZrDFQ2ehUGw8kxH6u"},"int":{"xpriv":"xprv9ztbaJYMADTpzuEkRPVdJkHNUmdBg98S2VUv91asoQzVTZtHsavn9SYuxy4iYwjpLZrmNy4oUJQoS6fGUJBMvT7Kfm3uvw1Q9b3DhJY23i5","xpub":"xpub6Dswyp5Ezb28DPKDXR2dftE72oTg5brHPiQWwPzVMkXULNDSR8F2hEsPpEZKhymsboomxhqiwmnvec5FTc36WuFWSGPtjQrL6YrQ6JWSBnh"},"type":1,"network":{"name":"BITCOIN_TESTNET","type":"testnet","bip":1,"segwit":true,"discovery":"http://92.207.178.198:3001/api","broadcastUrl":"https://chain.so/api/v2/send_tx/BTCTEST","feeApi":"https://api.blockcypher.com/v1/btc/main","connect":{"messagePrefix":"0018Bitcoin Signed Message:","bech32":"tb","bip32":{"public":70617039,"private":70615956},"pubKeyHash":111,"scriptHash":196,"wif":239}}},"erc20Wallet":""}');
  const coinData = { name: 'Bitcoin', decimals: 8 };
  const coinSDKSMock = {
    Bitcoin: {
      generateKeyPair: jest.fn().mockReturnValue({ address: '2NGBz7mknbB1GxFSddxa47C3S6qS4FuTnyd' }),
    },
  };
  QRCode.toDataURL = jest.fn().mockImplementation((address, options, onSuccess) => {
    return onSuccess(undefined, 'qrcode.png');
  });

  const defaultProps = {};
  function wrapperInit(options) {
    return mount(ReceiveCoin, options);
  }

  function storeInit(custom, propsData, path = '/wallet/single/receive/3') {
    storeMocks = createStoreMocks(custom);
    config.mocks.$store = storeMocks.store;
    Wallet.insert({ data: [walletData, walletData2] });
    Coin.$insert({ data: coinData });
    router = createRouter(storeMocks.store);
    router.push({ path });
    wrapper = wrapperInit({
      i18n,
      router,
      localVue,
      propsData,
      store: storeMocks.store,
      mocks: {
        coinSDKS: coinSDKSMock,
        errorHandler: jest.fn(),
      },
      stubs: {
        CoinHeader: true,
      },
    });
  }

  beforeEach(() => {
    cordovaMocks.initMocks();
    storeInit({}, defaultProps);
  });

  afterEach(() => { cordovaMocks.destroyMocks(); });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('back button routes to previous screen', (done) => {
    router.push({ path: '/wallet' });
    router.push({ path: '/wallet/single/receive/4' });
    wrapper.findAll('button').at(0).trigger('click');
    setTimeout(() => {
      expect(router.history.current.path).toBe('/wallet');
      done();
    }, 500);
  });

  describe('qrCode()', () => {
    it('it renders a qr code', (done) => {
      setTimeout(() => {
        expect(wrapper.contains('img')).toBe(true);
        done();
      }, 0);
    });

    it('it does not render a qr code if there is no wallet address', (done) => {
      storeInit({}, defaultProps, '/wallet/single/receive/4');
      setTimeout(() => {
        expect(wrapper.contains('img')).toBe(false);
        done();
      }, 0);
      QRCode.toDataURL = jest.fn().mockImplementationOnce((address, options, onError) => {
        return onError('error', {});
      });
    });

    it('can handle errors when the copy button is clicked', (done) => {
      setTimeout(() => {
        expect(wrapper.vm.errorHandler).toHaveBeenCalled();
        done();
      }, 0);
    });
  });

  describe('set amount', () => {
    it('generates a new qr code when a valid amount is entered', (done) => {
      QRCode.toDataURL = jest.fn().mockImplementation((address, options, onSuccess) => {
        qrContent = address;
        return onSuccess(undefined, 'qrcode.png');
      });
      wrapper.findAll('.set-amount').at(0).trigger('click');
      const amountInput = wrapper.find('input');
      amountInput.setValue('5');
      setTimeout(() => {
        expect(qrContent).toBe('bitcoin:2NGBz7mknbB1GxFSddxa47C3S6qS4FuTnyd?amount=5');
        done();
      }, 0);
    });

    it('doesn\'t generate a new qr code when amount is zero', (done) => {
      wrapper.findAll('.set-amount').at(0).trigger('click');
      const amountInput = wrapper.find('input');
      amountInput.setValue('0');
      setTimeout(() => {
        expect(qrContent).toBe('2NGBz7mknbB1GxFSddxa47C3S6qS4FuTnyd');
        done();
      }, 0);
    });

    it('doesn\'t generate a new qr code and displays an error if invalid amount', (done) => {
      wrapper.findAll('.set-amount').at(0).trigger('click');
      const amountInput = wrapper.find('input');
      amountInput.setValue('0.000000001');
      setTimeout(() => {
        expect(qrContent).toBe('2NGBz7mknbB1GxFSddxa47C3S6qS4FuTnyd');
        expect(wrapper.vm.amountError).toBe(wrapper.vm.$t('amountError'));
        done();
      }, 0);
    });

    it('resets qr code when set amount is closed', (done) => {
      wrapper.findAll('.set-amount').at(0).trigger('click');
      const amountInput = wrapper.find('input');
      amountInput.setValue('1');
      setTimeout(() => {
        expect(qrContent).toBe('bitcoin:2NGBz7mknbB1GxFSddxa47C3S6qS4FuTnyd?amount=1');
        wrapper.vm.toggleSetAmount(false);
        setTimeout(() => {
          expect(qrContent).toBe('2NGBz7mknbB1GxFSddxa47C3S6qS4FuTnyd');
          done();
        }, 550);
      }, 550);
    });
  });

  describe('copyToClipboard()', () => {
    it('can copy the address when the copy button is clicked', (done) => {
      wrapper.vm.$toast.create = jest.fn();
      cordova.plugins.clipboard.mockBehaviour = 1;
      wrapper.findAll('button').at(2).trigger('click');
      setTimeout(() => {
        expect(wrapper.vm.$toast.create).toHaveBeenCalled();
        done();
      }, 0);
    });

    it('can handle errors if a qr code cannot be generated', (done) => {
      wrapper.vm.$toast.create = jest.fn();
      cordova.plugins.clipboard.mockBehaviour = 2;
      wrapper.findAll('button').at(2).trigger('click');
      setTimeout(() => {
        expect(wrapper.vm.errorHandler).toHaveBeenCalled();
        done();
      }, 0);
    });
  });

  describe('share()', () => {
    it('calls the share api if the share button is clicked', (done) => {
      const mockPlugins = {
        socialsharing: {
          shareWithOptions: jest.fn().mockImplementationOnce((options, onSuccess) => {
            return onSuccess();
          }),
        },
      };
      global.plugins = mockPlugins;
      wrapper.findAll('button').at(1).trigger('click');
      setTimeout(() => {
        expect(mockPlugins.socialsharing.shareWithOptions).toHaveBeenCalledTimes(1);
        done();
      }, 0);
    });

    it('can handle errors when the share button is clicked', (done) => {
      const mockPlugins = {
        socialsharing: {
          shareWithOptions: jest.fn().mockImplementationOnce((options, onSuccess, onError) => {
            return onError('Test Error');
          }),
        },
      };
      global.plugins = mockPlugins;
      wrapper.findAll('button').at(1).trigger('click');
      setTimeout(() => {
        expect(mockPlugins.socialsharing.shareWithOptions).toHaveBeenCalledTimes(1);
        expect(wrapper.vm.errorHandler).toHaveBeenCalledWith(Error('Test Error'));
        done();
      }, 0);
    });
  });
});
