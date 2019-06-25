/* eslint-disable no-magic-numbers */
import { mount } from '@vue/test-utils';
import WalletItem from '@/components/Wallet/WalletItem';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';
import Coin from '@/store/wallet/entities/coin';
import Wallet from '@/store/wallet/entities/wallet';
import Address from '@/store/wallet/entities/address';
import Tx from '@/store/wallet/entities/tx';
import Utxo from '@/store/wallet/entities/utxo';


describe('WalletItem.vue', () => {
  let storeMocks;
  let wrapper;
  let router;

  const coinSDKS = {
    Ethereum: {
      generateKeyPair: jest.fn(),
    },
    ERC20: {
      generateERC20Wallet: jest.fn(),
    },
  };
  const activeWallets = {
    1: {
      Ethereum: {},
    },
  };
  const errorHandler = jest.fn();

  const propsData = {
    wallet: {
      id: 1,
      name: 'Catalyst',
      displayName: 'Catalyst',
      parentName: 'Ethereum',
      symbol: 'CAT',
      network: 'ETHEREUM_ROPSTEN',
      sdk: 'ERC20',
    },
    clickItemAction: 'addWallet',
  };

  function wrapperInit(options) {
    Wallet.$insert({
      data: [{
        id: 1,
        account_id: 1,
        name: 'Catalyst',
        displayName: 'Catalyst',
        parentName: 'Ethereum',
        symbol: 'CAT',
        network: 'ETHEREUM_ROPSTEN',
        sdk: 'ERC20',
        enabled: false,
      },
      {
        id: 2,
        account_id: 1,
        name: 'Bitcoin',
        displayName: 'Bitcoin',
        symbol: 'BTC',
        network: 'BITCOIN',
        sdk: 'Bitcoin',
        enabled: true,
      },
      {
        id: 5,
        account_id: 1,
        name: 'Ethereum',
        displayName: 'Ethereum',
        sdk: 'Ethereum',
        symbol: 'ETH',
      },
      ],
    });

    Coin.$insert({
      data: [{
        name: 'Bitcoin',
      },
      {
        name: 'Ethereum',
      },
      {
        name: 'Catalyst',
        imported: true,
      },
      {
        name: '0xProtocol',
        sdk: 'ERC20',
      },
      ],
    });

    return mount(WalletItem, options);
  }

  function storeInit(custom) {
    storeMocks = createStoreMocks(custom);
    router = createRouter(storeMocks.store);
    router.push({ path: '/' });
    wrapper = wrapperInit({
      i18n,
      router,
      localVue,
      store: storeMocks.store,
      propsData,
      mocks: { coinSDKS, activeWallets, errorHandler },
    });
  }

  beforeEach(() => { return storeInit(); });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('enables a wallet on toggle', async (done) => {
    Wallet.$update = Wallet.update;
    const toggle = wrapper.find('input');
    toggle.trigger('click');
    setTimeout(() => {
      const wallets = Wallet.all();
      expect(wallets[0].enabled).toBe(true);
      done();
    }, 0);
  });

  it('enables ethereum when a erc20 wallet is enabled', async (done) => {
    Wallet.$update = Wallet.update;
    const toggle = wrapper.find('input');
    toggle.trigger('click');
    setTimeout(() => {
      const wallets = Wallet.all();
      expect(wallets[0].enabled).toBe(true);
      expect(wallets[1].enabled).toBe(true);
      done();
    }, 0);
  });

  it('it handles any errors when a wallet is enabled', async (done) => {
    async function check() {
      throw new Error('Test');
    }
    Wallet.$update = check();
    const toggle = wrapper.find('input');
    toggle.trigger('click');
    setTimeout(() => {
      expect(errorHandler).toHaveBeenCalled();
      done();
    }, 0);
  });

  it('creates a new wallet if a new ERC20 token is added', (done) => {
    Wallet.$update = Wallet.update;
    propsData.wallet = {
      id: 3,
      name: '0xProtocol',
      displayName: '0x Protocol',
      parentName: 'Ethereum',
      symbol: 'ZRX',
      network: 'ETHEREUM',
      sdk: 'ERC20',
      contractAddress: '000000',
      decimals: 18,
    };
    storeInit();
    Coin.$insert({
      data: [{ name: 'Ethereum', sdk: 'Ethereum' },
      ],
    });
    Wallet.$update({
      where: (record) => { return record.id === 5; },
      data: { imported: false, enabled: true },
    });
    const toggle = wrapper.find('input');
    toggle.trigger('click');
    setTimeout(() => {
      const wallets = Wallet.all();
      expect(wallets.length).toBe(4);
      expect(wallets[3].enabled).toBe(true);
      expect(wallets[3].name).toEqual('0xProtocol');
      done();
    }, 0);
  });

  it('disables a wallet on toggle', (done) => {
    propsData.wallet = {
      id: 2,
      name: 'Bitcoin',
      displayName: 'Bitcoin',
      symbol: 'BTC',
      network: 'BITCOIN',
      sdk: 'Bitcoin',
    };
    storeInit();
    Tx.$insert({ data: [{ id: 1, wallet_id: 2 }] });
    Utxo.$insert({ data: [{ id: 1, wallet_id: 2 }] });
    Address.$insert({ data: [{ id: 1, wallet_id: 2 }] });
    const toggle = wrapper.find('input');
    toggle.trigger('click');
    setTimeout(() => {
      const wallets = Wallet.all();
      expect(wallets[1].enabled).toBe(false);
      expect(Tx.all()).toEqual([]);
      expect(Utxo.all()).toEqual([]);
      expect(Address.all()).toEqual([]);
      done();
    }, 0);
  });

  it('disables a erc20 wallets when ethereum is disabled', (done) => {
    propsData.wallet = {
      id: 5,
      account_id: 1,
      name: 'Ethereum',
      displayName: 'Ethereum',
      sdk: 'Ethereum',
      symbol: 'ETH',
    };
    storeInit();
    Wallet.$update({
      where: (record) => { return record.id === 1; },
      data: { imported: false, enabled: true },
    });
    Wallet.$update({
      where: (record) => { return record.id === 5; },
      data: { imported: false, enabled: true },
    });
    Tx.$insert({ data: [{ id: 1, wallet_id: 5 }] });
    Utxo.$insert({ data: [{ id: 1, wallet_id: 5 }] });
    Address.$insert({ data: [{ id: 1, wallet_id: 1 }] });
    const toggle = wrapper.find('input');
    toggle.trigger('click');
    setTimeout(() => {
      const wallets = Wallet.all();
      expect(wallets[2].enabled).toBe(false);
      expect(wallets[0].enabled).toBe(false);
      expect(Address.all()).toEqual([]);
      expect(Tx.all()).toEqual([]);
      expect(Utxo.all()).toEqual([]);
      done();
    }, 0);
  });

  it('can delete an imported token', (done) => {
    // eslint-disable-next-line no-console
    console.error = jest.fn();
    propsData.wallet = {
      id: 1,
      name: 'Catalyst',
      displayName: 'Catalyst',
      parentName: 'Ethereum',
      symbol: 'CAT',
      network: 'ETHEREUM',
      sdk: 'ERC20',
      contractAddress: '000000',
      decimals: 18,
    };
    storeInit();
    const reset = jest.fn();
    wrapper.vm.onRight({ reset });
    wrapper.vm.confirmDelete();
    wrapper.vm.deleteWallet();
    setTimeout(() => {
      expect(reset).toHaveBeenCalled();
      expect(Wallet.all().length).toBe(2);
      expect(Coin.all().length).toBe(3);
      done();
    }, 0);
  });
});
