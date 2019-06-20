/* eslint-disable no-magic-numbers */
import { shallowMount } from '@vue/test-utils';
import Login from '@/pages/Auth/Login';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';
import Account from '@/store/wallet/entities/account';
import Wallet from '@/store/wallet/entities/wallet';

describe('Login.vue', () => {
  let wrapper;
  let BackEndService;
  let backEndService;
  let errorHandler;
  let storeMocks;
  let router;
  let $toast;
  const propsData = {};
  const activeWallets = {};
  const mockAccount = {
    $id: 1,
    id: 1,
    uid: 'eaeb9367-442e-8c57-7d98-73ed3840e149',
    refresh_token: 'U2FsdGVkX180Vyx3OSXXJzhifc2LQf6wKqd+KLN/vWYJT0SJ89lo8r3RzW1bXiC1xFz4KL/UwJ9x5LbYfoQvVj8dXWZfDX7HGo9IK0QBMCd0stkMGOpaARxISBcece2YD/4JtOsu9FudP1LYEH2G6mhFSvgtaSkLDgp9f4ZslVrk7Vd7FxEgNGonEl4+bqhBqhKncCCWdWKrYYqnnHFf2GjT/eExe+skkGRRgYLmE0yFBgfHn3BHooF601rfpV5WYwQA7z2rHpnuZsQoULZslg==',
    salt: '$2a$10$3rMsoVY/7P58fLB04dIa8e',
    pinHash: '$2a$10$jqWXqHKd9uRxKo7.zfzQf.CTXCdbhlID0ZZbumux1r7sI.yUOxXsC',
    name: 'Stephen',
    locale: 'en-gb',
    currency: '',
    node: null,
    default: true,
  };
  const walletData = JSON.parse('{"$id":1,"id":1,"account_id":1,"name":"Litecoin","displayName":"Litecoin","symbol":"LTC","sdk":"Bitcoin","network":"LITECOIN_TESTNET","internalChainAddressIndex":4,"externalChainAddressIndex":2,"externalAddress":"QXEjChFGFsGPn9XWYEzCuCTN7Ujsi2j3va","confirmedBalance":10.42288029,"unconfirmedBalance":0,"imported":true,"enabled":true,"lastBlockHeight":0,"parentName":"","parentSdk":"","contractAddress":"","decimals":"","hdWallet":"U2FsdGVkX18tI5wGYddk8+bwlJOR4L/PnY2vZtGNued5xmhdqG0XGivIdnDfmqyrOXdM2kp8vZaxTXUx6I1MXlbnTuCSEGQb+nOR1Z6tBjHfyOCjZl+MSPHqDNrhy3+MU5+NVyfi69ZL0ZPE8xODmgcJyMzM/jQamMoH9F9Qlt6ckwWejrAUYsb7VsRAS2hnVk/3m2QB1a9zre+4vRts6OsqJOVbPO4v6tFORt8H0wh8sIuuVXvjsR3xOj7yzUjVugT6F1YV4F/aCAdmFL4IoKB/i69vG9f7K1UB251pUTnyM+CyuVVNmvpSwlJcQRBHUYkLQrbaDpHVmh3Ey40fDpii34i+T8FFVhf7XOlsdz9Wzjof0hBARlBfwYlRy9lbuoIJ97kKVYbIA0b1f2SvXGnGGLEOgcEjUiQlzzl7atLv7vFZzcB9PFqDgxB7OhKXqz05/uwmtaEQ6roi/g3VDdXE0h7+g1RhzbqiYfZeofOHJ3ENtve6Xcznx9YpxEcWirjPo4XZ6cYDTFHCd0X2wz7dYFClV1ADgwlUqZ2VzP2BlYYKTKfZbfLZpdH968ZtOxXhCmVsIw14FiAmsUhdq5XN7p8xiWIqU7QnucuRE32upUwCN17EtWborSArvh6ZmjNPnkwyf/BA2/LAmp3/2Xj2D+8GnpOe/8WFYxmXrAYdSjG/Hxytm8aOvP4hcsi1gMzCnfw1ZX9EqxJsKAfKenpBbN6mfsVP7osRLPzU6aCwnS/hYPM+UIY0bUqZDiCtHbY4jNXRgcw44zPDYe7+PTmO12mKzD0h7w3TEBH8dRA80XscYKwLnbLsxPhK8Cjr7kVU31uSIKcG9X4mBLtYHxtWjqZINuWuqFajYXhHIDmlnno6ieRkLy1C1AN0PuG51WlvpSPqFNvVB26IHhhZzRC0aUjIXwWjCuEBT88y0IsDKCh1jRYwFcxjzv5MkiSU8OCNi79GbRek5cvvZ3QbkI8p3PCr691a+Mcd39CKa7pjzhUJFZmpUPusjeE2s2R2s+RF5O3ufDrdhRYE/YItXVhdsplwzeeEIZro/SHwCLSBx7pILZunfQ6lLe8c32eRtoZilkMZs7Svip/lWzVbfLllv5Tcf/adqDdgpaXZujiaTJ/se4dlYBL129YW0o/0Gv6h5Xg704WbJTk9DSSvwfwxhm8v612uevHU8Gem7XGLD6/xmdCJHQBTfrgKiw7nkIQex/u6UhWxrMiHfJz1MUTModhIEhWGGbhQTYEA7CQ=","erc20Wallet":""}');
  const erc20WalletData = JSON.parse('{"$id":5,"id":5,"account_id":1,"name":"Catalyst","displayName":"Catalyst","symbol":"CAT","sdk":"ERC20","network":"ETHEREUM_ROPSTEN","internalChainAddressIndex":0,"externalChainAddressIndex":0,"externalAddress":"0x5d7DE0a3f75E0e9c3163413870938bEE612e07D6","confirmedBalance":500,"unconfirmedBalance":0,"imported":true,"enabled":true,"lastBlockHeight":0,"parentName":"Ethereum","parentSdk":"Ethereum","contractAddress":"0x26705403968a8c73656a2fed0f89245698718f3f","decimals":3,"hdWallet":"","erc20Wallet":{"decimals":3,"address":"0x5d7DE0a3f75E0e9c3163413870938bEE612e07D6","network":{"name":"ETHEREUM_ROPSTEN","networkName":"ropsten","bip":60,"getTranApi":"http://api-ropsten.etherscan.io/api?module=account&action=txlist&address=","getBalanceApi":"https://api-ropsten.etherscan.io/api?module=account&action=balance&address=","getErc20TranApi":"http://api-ropsten.etherscan.io/api?module=account&action=tokentx&contractaddress=","feeApi":"https://api.blockcypher.com/v1/eth/main","provider":"https://ropsten.infura.io/v3/352fc30cd8364caabaea4a3d67da773f","chainId":3},"name":"Catalyst","symbol":"CAT","contract":"0x26705403968a8c73656a2fed0f89245698718f3f"}}');
  const customStore = {
    state: {
      settings: {
        selectedAccount: 'Stephen',
      },
    },
  };
  function wrapperInit(options) {
    return shallowMount(Login, options);
  }

  function storeInit(custom) {
    $toast = {
      create: jest.fn(),
    };
    errorHandler = jest.fn();
    backEndService = {
      connect: jest.fn().mockResolvedValue(true),
      loadPriceFeed: jest.fn(),
    };
    BackEndService = jest.fn().mockImplementation(() => {
      return {
        connect: jest.fn(),
        loadPriceFeed: jest.fn(),
      };
    });
    storeMocks = createStoreMocks(custom);
    router = createRouter(storeMocks.store);
    Account.$insert({ data: [mockAccount] });
    Wallet.insert({ data: [walletData, erc20WalletData] });
    router.push({ path: '/' });
    wrapper = wrapperInit({
      i18n,
      router,
      localVue,
      propsData,
      store: storeMocks.store,
      mocks: {
        BackEndService,
        backEndService,
        errorHandler,
        activeWallets,
        $toast,
      },
    });
  }

  beforeEach(() => { storeInit(); });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('displays the account name', () => {
    expect(wrapper.text()).toEqual('Stephen');
  });

  it('resets the pin', () => {
    wrapper.vm.pin = [0, 0, 0, 0, 0, 0];
    wrapper.vm.resetPin();
    expect(wrapper.vm.pin).toEqual([]);
  });

  it('listens for pin input', () => {
    wrapper.vm.$root.$emit('inputPin', 1);
    wrapper.vm.$root.$emit('inputPin', 2);
    wrapper.vm.$root.$emit('inputPin', 3);
    wrapper.vm.$root.$emit('inputPin', 4);

    expect(wrapper.vm.pin).toEqual([1, 2, 3, 4]);
  });

  it('sets the authenticated account in the store on successful login', (done) => {
    wrapper.vm.pin = [0, 0, 0, 0, 0, 0];
    wrapper.vm.attemptUnlock();
    setTimeout(() => {
      expect(storeMocks.actions.setLoading).toHaveBeenCalled();
      expect(storeMocks.actions.setAuthenticatedAccount).toHaveBeenCalled();
      done();
    }, 1000);
  });

  it('decrypts the wallet data and initialises them', (done) => {
    const wallets = Wallet.all();
    wrapper.vm.pin = [0, 0, 0, 0, 0, 0];
    wrapper.vm.attemptUnlock();
    setTimeout(() => {
      expect(wallets[0].hdWallet.ext.xpub).toEqual('xpub6Dswyp5Ezb28B7AG7yWDCS7QLDa5kPAgt6mHYQgw11krarWYviyKwRcYNbeutQRsNtQn1DD9SnaXHMpwpzAEDnBxvZZrDFQ2ehUGw8kxH6u');
      expect(wrapper.vm.activeWallets[1].Litecoin).toBeTruthy();
      expect(wrapper.vm.activeWallets[1].Catalyst).toBeTruthy();
      done();
    }, 1000);
  });

  it('creates a backEndService and loads the price feed', (done) => {
    wrapper.vm.pin = [0, 0, 0, 0, 0, 0];
    wrapper.vm.attemptUnlock();
    setTimeout(() => {
      expect(BackEndService).toHaveBeenCalled();
      expect(backEndService.connect).toHaveBeenCalled();
      expect(backEndService.loadPriceFeed).toHaveBeenCalled();
      done();
    }, 1000);
  });

  it('displays a wrong pin toast if pin doesn\'t match', (done) => {
    const mockResetPin = jest.fn();
    wrapper.setMethods({ resetPin: mockResetPin });

    const mockResetState = jest.fn();
    wrapper.vm.$refs.PinPad = {
      resetState: mockResetState,
    };

    wrapper.vm.pin = [0, 0, 0, 0, 0, 1];
    wrapper.vm.attemptUnlock();
    setTimeout(() => {
      expect(wrapper.vm.$toast.create).toHaveBeenCalled();
      expect(mockResetState).toHaveBeenCalled();
      expect(mockResetPin).toHaveBeenCalled();
      done();
    }, 500);
  });

  it('catches errors', (done) => {
    mockAccount.id = 2;
    mockAccount.default = false;
    storeInit(customStore);
    wrapper.vm.pin = [0, 0, 0, 0, 0, 0];
    wrapper.vm.attemptUnlock();
    backEndService.connect.mockImplementationOnce(() => { throw new Error('Test Error'); });
    setTimeout(() => {
      expect(errorHandler).toHaveBeenCalled();
      done();
    }, 1000);
  });
});
