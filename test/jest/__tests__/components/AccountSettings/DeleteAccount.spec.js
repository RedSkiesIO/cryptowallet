/* eslint-disable no-magic-numbers */
import { shallowMount } from '@vue/test-utils';
import DeleteAccount from '@/components/AccountSettings/DeleteAccount';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';
import Account from '@/store/wallet/entities/account';
import Wallet from '@/store/wallet/entities/wallet';
import Tx from '@/store/wallet/entities/tx';
import Utxo from '@/store/wallet/entities/utxo';
import Address from '@/store/wallet/entities/address';

const accountData = JSON.parse('{"$id":1,"id":1,"uid":"62b49f90-d795-bea0-7cdf-5c7a7f18d2e3","refresh_token":"U2FsdGVkX1+SrO40Mx8VS2EHhvK2/X3G25XK4+jsH2fgzG9IuCuEHR7ckI57DNe1riwz7lNafU1ecQFezy/Ov1W98Fg2dPHJBV8GGgadEbLsGxOVoe0d8L+05yALcWWaumNnMYIearOs/AMqhZkuwMTM16jtsgyIxgqFYPsXzAqdMI/V1rdh5Wjtkb1ZQQ2s5SBBAkWUFB6yr92ACebzF5TCkRLGlJqBQpAPNEwtMh4TI+rRHFqo9SBDrCoElQGGIq7mhEmhkmv+CKPQX1eD6Q==","salt":"$2a$10$8NJPPf3O6RY3UI98PjOYou","pinHash":"$2a$10$8NJPPf3O6RY3UI98PjOYouYOfeDyVVKD4cPqefFJHmqkhsLwTfEZC","name":"Konrad","locale":"en-gb","currency":"GBP","node":null,"default":true,"seed":"U2FsdGVkX19WR8fHv2QN8AN9s95N/QNMPvTCCas0AUgcsnJGC4El5Y54Y+0R2dNp0cwbaBypbQ/VhPay5WD1cYzIMMZPoknXHEYnvVPbMChRksNc+VyBt6bTriQcDak0bSREJdrqwQX7JDClECKXQWF5w7eMDf1RLgs/cOfSCYI=","wallets":[]}');
const walletData = JSON.parse('{"$id":3,"id":3,"account_id":1,"name":"Bitcoin","displayName":"Bitcoin","symbol":"BTC","sdk":"Bitcoin","network":"BITCOIN_TESTNET","internalChainAddressIndex":0,"externalChainAddressIndex":1,"externalAddress":null,"confirmedBalance":0,"unconfirmedBalance":0,"imported":true,"enabled":true,"lastBlockHeight":0,"parentName":"","parentSdk":"","contractAddress":"","decimals":"","hdWallet":{"bip":49,"ext":{"xpriv":"xprv9zZZrtcYB6bg2sxhoVYYKAM8duZHP1MwV1SYNVLStU6qpY6NCKfuTCeeHe1MsBeYDt7XipqZYtshoGC9ghNZ6EVwugKxUPM7m2tFmExu2mt","xpub":"xpub6DYvGQ9S1U9yFN3AuX5YgJHsBwPmnU5nrEN9Ask4SodphLRWjrz9zzy88v6HFPGJuDoMg7hhEG2yFFhU7Djqx3AoE57hEL748iFp26JLXtC"},"int":{"xpriv":"xprv9zZZrtcYB6bg6LXLr8kweVuqCWUTc5dnFDJ526bEyz5pLHdfHRx2D1UPLE8bZy6hK8f1YpXQHeGF2FWEds5S1MSbTH2boaQRNUoz6vy4MRq","xpub":"xpub6DYvGQ9S1U9yJpboxAHx1drZkYJx1YMdcSDfpUzrYKcoD5xopyGGkonsBXbmCnHteYYMcjgWRU7EyByaGf8Mav4y5BTkYmC2TD2JVPmkJxs"},"type":1,"network":{"name":"BITCOIN_TESTNET","type":"testnet","bip":1,"segwit":true,"discovery":"http://92.207.178.198:3001/api","broadcastUrl":"https://chain.so/api/v2/send_tx/BTCTEST","feeApi":"https://api.blockcypher.com/v1/btc/main","connect":{"messagePrefix":"Bitcoin Signed Message:","bech32":"tb","bip32":{"public":70617039,"private":70615956},"pubKeyHash":111,"scriptHash":196,"wif":239}}},"erc20Wallet":""}');

describe('DeleteAccount component', () => {
  let wrapper;
  let router;
  let storeMocks;

  const defaultProps = {
    open: true,
    pinHash: accountData.pinHash,
  };

  const mockToast = {
    create: jest.fn(),
  };

  const resetStateMock = jest.fn();


  function wrapperInit(options) {
    return shallowMount(DeleteAccount, options);
  }

  function storeInit(custom, propsData, parentComponent = null) {
    storeMocks = createStoreMocks(custom);
    router = createRouter(storeMocks.store);
    router.push({ path: '/settings' });

    Account.insert({ data: accountData });
    Wallet.insert({ data: walletData });
    Tx.insert({ data: { account_id: 1 } });
    Utxo.insert({ data: { account_id: 1 } });
    Address.insert({ data: { account_id: 1 } });

    wrapper = wrapperInit({
      i18n,
      router,
      localVue,
      propsData,
      parentComponent,
      store: storeMocks.store,
      mocks: {
        errorHandler: jest.fn(),
        $toast: mockToast,
      },
    });
  }

  beforeEach(() => {
    storeInit({}, defaultProps);
    wrapper.vm.$refs.PinPad = {
      resetState: resetStateMock,
    };
  });

  it('renders and matches snapshot', async (done) => {
    setTimeout(() => {
      expect(wrapper.element).toMatchSnapshot();
      done();
    }, 1000);
  });

  describe('methods', () => {
    describe('resetPin()', () => {
      it('resets the pin array', () => {
        wrapper.vm.pin = [0, 1, 2];
        wrapper.vm.resetPin();
        expect(wrapper.vm.pin.length).toBe(0);
      });
    });

    describe('pinInputListener()', () => {
      it('adds an item into the pin array', () => {
        const item = 'item';
        wrapper.vm.resetPin();
        wrapper.vm.pinInputListener(item);
        expect(wrapper.vm.pin[0]).toBe(item);
      });
    });

    describe('attemptUnlock()', () => {
      it('opens the confirmation dialog and resets the PinPad state if valid pin was entered', () => {
        wrapper.vm.pin = [0, 0, 0, 0, 0, 0];
        wrapper.vm.attemptUnlock();

        expect(resetStateMock).toHaveBeenCalled();
        expect(wrapper.vm.pin.length).toBe(0);
        expect(wrapper.vm.confirmDeleteOpen).toBeTruthy();
      });

      it('display an error if an invalid pin was entered', () => {
        wrapper.vm.pin = [1, 2, 3, 4, 5, 6, 7, 8];
        wrapper.vm.attemptUnlock();

        expect(resetStateMock).toHaveBeenCalledTimes(2);
        expect(wrapper.vm.pin.length).toBe(0);
        expect(wrapper.vm.confirmDeleteOpen).toBeFalsy();
        expect(mockToast.create).toHaveBeenCalled();
      });
    });

    describe('closeModal()', () => {
      it('emits closePinModal event and resets state', () => {
        wrapper.vm.pin = [1, 2, 3, 4, 5, 6, 7, 8];
        wrapper.vm.closeModal();

        expect(resetStateMock).toHaveBeenCalledTimes(3);
        expect(wrapper.vm.pin.length).toBe(0);
        expect(wrapper.emitted().closePinModal).toBeTruthy();
      });
    });

    describe('deleteAccount()', () => {
      it('deletes the account and data belonging to it', async (done) => {
        const closeModalMock = jest.fn();
        wrapper.setMethods({
          closeModal: closeModalMock,
        });

        wrapper.vm.deleteAccount();

        setTimeout(() => {
          expect(storeMocks.actions.setLoading.mock.calls[0][1]).toBe(true);
          expect(storeMocks.actions.setLoading.mock.calls[1][1]).toBe(false);
          expect(storeMocks.actions.setLayout.mock.calls[0][1]).toBe('dark');
          expect(storeMocks.actions.setSelectedAccount.mock.calls[0][1]).toBe(null);
          expect(storeMocks.actions.setAuthenticatedAccount.mock.calls[0][1]).toBe(null);
          expect(closeModalMock).toHaveBeenCalled();

          done();
        }, 500);
      });

      it('changes the default account if deleted account was default', async (done) => {
        const closeModalMock = jest.fn();
        wrapper.setMethods({
          closeModal: closeModalMock,
        });

        const accountNotDefault = JSON.parse('{"$id":2,"id":2,"name":"Konrad Not Default","default":false}');
        Account.insert({ data: accountNotDefault });
        expect(Account.all().length).toBe(2);
        wrapper.vm.deleteAccount();

        setTimeout(() => {
          expect(Account.all().length).toBe(1);
          expect(Account.all()[0].id).toBe(2);
          expect(Account.all()[0].default).toBe(true);
          done();
        }, 500);
      });
    });
  });
});
