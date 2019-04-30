/* eslint-disable no-magic-numbers */
import ReceiveCoin from '@/components/Wallet/ReceiveCoin';
import { mount } from '@vue/test-utils';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';
import Wallet from '@/store/wallet/entities/wallet';
import Address from '@/store/wallet/entities/address';
import cordovaMocks from '~/test/CordovaMocks';
import QRCode from 'qrcode';


describe('ReceiveCoin component', () => {
  let wrapper;
  let router;
  let storeMocks;

  const walletData = JSON.parse('{"$id":3,"id":3,"account_id":1,"name":"Bitcoin","displayName":"Bitcoin","symbol":"BTC","sdk":"Bitcoin","network":"BITCOIN_TESTNET","internalChainAddressIndex":23,"externalChainAddressIndex":15,"externalAddress": null,"confirmedBalance":0.52543197,"unconfirmedBalance":0,"imported":false,"enabled":false,"lastBlockHeight":0,"parentName":"","parentSdk":"","contractAddress":"","decimals":"","hdWallet":{"bip":49,"ext":{"xpriv":"xprv9ztbaJYMADTpxd5o1wyCqJAfnBjbLvSqWsqgk2HKSgDsi4BQPBf5PdJ4XLPZd4ugHQ9o45sExCuJuWBnxyu61Gt7fVj1kAPoB1hsze1XNAC","xpub":"xpub6Dswyp5Ezb28B7AG7yWDCS7QLDa5kPAgt6mHYQgw11krarWYviyKwRcYNbeutQRsNtQn1DD9SnaXHMpwpzAEDnBxvZZrDFQ2ehUGw8kxH6u"},"int":{"xpriv":"xprv9ztbaJYMADTpzuEkRPVdJkHNUmdBg98S2VUv91asoQzVTZtHsavn9SYuxy4iYwjpLZrmNy4oUJQoS6fGUJBMvT7Kfm3uvw1Q9b3DhJY23i5","xpub":"xpub6Dswyp5Ezb28DPKDXR2dftE72oTg5brHPiQWwPzVMkXULNDSR8F2hEsPpEZKhymsboomxhqiwmnvec5FTc36WuFWSGPtjQrL6YrQ6JWSBnh"},"type":1,"network":{"name":"BITCOIN_TESTNET","type":"testnet","bip":1,"segwit":true,"discovery":"http://92.207.178.198:3001/api","broadcastUrl":"https://chain.so/api/v2/send_tx/BTCTEST","feeApi":"https://api.blockcypher.com/v1/btc/main","connect":{"messagePrefix":"0018Bitcoin Signed Message:","bech32":"tb","bip32":{"public":70617039,"private":70615956},"pubKeyHash":111,"scriptHash":196,"wif":239}}},"erc20Wallet":""}');
  const addressData = JSON.parse('{"$id":1,"id":1,"wallet_id":3,"account_id":1,"address":"2MwSB1utt5aMRp8tY92wNjBpb96UfpDKHX7","index":0,"chain":"external","used":false}');
  const erc20WalletData = JSON.parse('{"$id":45,"id":45,"account_id":10,"name":"Catalyst","displayName":"Catalyst","symbol":"CAT","sdk":"ERC20","network":"ETHEREUM_ROPSTEN","internalChainAddressIndex":0,"externalChainAddressIndex":0,"externalAddress":null,"confirmedBalance":0,"unconfirmedBalance":0,"imported":false,"enabled":false,"lastBlockHeight":0,"parentName":"Ethereum","parentSdk":"Ethereum","contractAddress":"0x26705403968a8c73656a2fed0f89245698718f3f","decimals":3,"hdWallet":"","erc20Wallet":{"decimals":3,"address":"0xC25Ec706b3835B71Ec713dDAD3557c8413b76913","network":{"name":"ETHEREUM_ROPSTEN","networkName":"ropsten","bip":60,"getTranApi":"http://api-ropsten.etherscan.io/api?module=account&action=txlist&address=","getBalanceApi":"https://api-ropsten.etherscan.io/api?module=account&action=balance&address=","getErc20TranApi":"http://api-ropsten.etherscan.io/api?module=account&action=tokentx&contractaddress=","feeApi":"https://api.blockcypher.com/v1/eth/main","provider":"https://ropsten.infura.io/v3/352fc30cd8364caabaea4a3d67da773f","chainId":3},"name":"Catalyst","symbol":"CAT","contract":"0x26705403968a8c73656a2fed0f89245698718f3f"}}');
  const coinSDKSMock = {
    Bitcoin: {
      generateKeyPair: jest.fn().mockReturnValue({ address: '2NGBz7mknbB1GxFSddxa47C3S6qS4FuTnyd' }),
    },
  };


  const defaultProps = {};
  function wrapperInit(options) {
    return mount(ReceiveCoin, options);
  }

  function storeInit(custom, propsData, path = '/wallet/single/receive/3') {
    storeMocks = createStoreMocks(custom);
    Wallet.insert({ data: walletData, erc20WalletData });
    Address.insert({ data: addressData });

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

  describe('qrCode()', () => {
    it('it renders a qr code', async (done) => {
      setTimeout(() => {
        expect(wrapper.contains('img')).toBe(true);
        done();
      }, 1000);
      QRCode.toDataURL = jest.fn().mockImplementationOnce((address, options, onError) => {
        return onError('error', {});
      });
    });

    it('can handle errors when the copy button is clicked', async (done) => {
      setTimeout(() => {
        expect(wrapper.vm.errorHandler).toHaveBeenCalled();
        done();
      }, 1000);
    });
  });

  describe('copyToClipboard()', () => {
    it('can copy the address when the copy button is clicked', async (done) => {
      storeInit({}, defaultProps, '/wallet/single/receive/4');
      wrapper.vm.$toast.create = jest.fn();
      cordova.plugins.clipboard.mockBehaviour = 1;
      wrapper.findAll('button').at(0).trigger('click');
      setTimeout(() => {
        expect(wrapper.vm.$toast.create).toHaveBeenCalled();
        done();
      }, 1000);
    });

    it('can handle errors if a qr code cannot be generated', async (done) => {
      wrapper.vm.$toast.create = jest.fn();
      cordova.plugins.clipboard.mockBehaviour = 2;
      wrapper.findAll('button').at(0).trigger('click');
      setTimeout(() => {
        expect(wrapper.vm.errorHandler).toHaveBeenCalled();
        done();
      }, 1000);
    });
  });

  describe('share()', () => {
    it('calls the share api if the share button is clicked', async (done) => {
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
      }, 1000);
    });

    it('can handle errors when the share button is clicked', async (done) => {
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
      }, 1000);
    });
  });
});
