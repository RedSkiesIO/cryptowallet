/* eslint-disable no-magic-numbers */
import { shallowMount } from '@vue/test-utils';
import Pin from '@/components/AccountSettings/Pin';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';
import Account from '@/store/wallet/entities/account';
import Wallet from '@/store/wallet/entities/wallet';
import AES from 'crypto-js/aes';

const accountData = JSON.parse('{"$id":1,"id":1,"uid":"62b49f90-d795-bea0-7cdf-5c7a7f18d2e3","refresh_token":"U2FsdGVkX1+SrO40Mx8VS2EHhvK2/X3G25XK4+jsH2fgzG9IuCuEHR7ckI57DNe1riwz7lNafU1ecQFezy/Ov1W98Fg2dPHJBV8GGgadEbLsGxOVoe0d8L+05yALcWWaumNnMYIearOs/AMqhZkuwMTM16jtsgyIxgqFYPsXzAqdMI/V1rdh5Wjtkb1ZQQ2s5SBBAkWUFB6yr92ACebzF5TCkRLGlJqBQpAPNEwtMh4TI+rRHFqo9SBDrCoElQGGIq7mhEmhkmv+CKPQX1eD6Q==","salt":"$2a$10$8NJPPf3O6RY3UI98PjOYou","pinHash":"$2a$10$8NJPPf3O6RY3UI98PjOYouYOfeDyVVKD4cPqefFJHmqkhsLwTfEZC","name":"Konrad","locale":"en-gb","currency":"GBP","node":null,"default":true,"seed":"U2FsdGVkX19WR8fHv2QN8AN9s95N/QNMPvTCCas0AUgcsnJGC4El5Y54Y+0R2dNp0cwbaBypbQ/VhPay5WD1cYzIMMZPoknXHEYnvVPbMChRksNc+VyBt6bTriQcDak0bSREJdrqwQX7JDClECKXQWF5w7eMDf1RLgs/cOfSCYI=","wallets":[]}');
const walletData = JSON.parse('{"$id":3,"id":3,"account_id":1,"name":"Bitcoin","displayName":"Bitcoin","symbol":"BTC","sdk":"Bitcoin","network":"BITCOIN_TESTNET","internalChainAddressIndex":0,"externalChainAddressIndex":1,"externalAddress":null,"confirmedBalance":0,"unconfirmedBalance":0,"imported":true,"enabled":true,"lastBlockHeight":0,"parentName":"","parentSdk":"","contractAddress":"","decimals":"","hdWallet":{"bip":49,"ext":{"xpriv":"xprv9zZZrtcYB6bg2sxhoVYYKAM8duZHP1MwV1SYNVLStU6qpY6NCKfuTCeeHe1MsBeYDt7XipqZYtshoGC9ghNZ6EVwugKxUPM7m2tFmExu2mt","xpub":"xpub6DYvGQ9S1U9yFN3AuX5YgJHsBwPmnU5nrEN9Ask4SodphLRWjrz9zzy88v6HFPGJuDoMg7hhEG2yFFhU7Djqx3AoE57hEL748iFp26JLXtC"},"int":{"xpriv":"xprv9zZZrtcYB6bg6LXLr8kweVuqCWUTc5dnFDJ526bEyz5pLHdfHRx2D1UPLE8bZy6hK8f1YpXQHeGF2FWEds5S1MSbTH2boaQRNUoz6vy4MRq","xpub":"xpub6DYvGQ9S1U9yJpboxAHx1drZkYJx1YMdcSDfpUzrYKcoD5xopyGGkonsBXbmCnHteYYMcjgWRU7EyByaGf8Mav4y5BTkYmC2TD2JVPmkJxs"},"type":1,"network":{"name":"BITCOIN_TESTNET","type":"testnet","bip":1,"segwit":true,"discovery":"http://92.207.178.198:3001/api","broadcastUrl":"https://chain.so/api/v2/send_tx/BTCTEST","feeApi":"https://api.blockcypher.com/v1/btc/main","connect":{"messagePrefix":"Bitcoin Signed Message:","bech32":"tb","bip32":{"public":70617039,"private":70615956},"pubKeyHash":111,"scriptHash":196,"wif":239}}},"erc20Wallet":""}');

describe('Pin component', () => {
  let wrapper;
  let router;
  let storeMocks;

  const defaultProps = {
    open: true,
    pinHash: accountData.pinHash,
  };

  function wrapperInit(options) {
    return shallowMount(Pin, options);
  }

  function storeInit(custom, propsData, parentComponent = null) {
    storeMocks = createStoreMocks(custom);
    router = createRouter(storeMocks.store);
    router.push({ path: '/settings' });

    Account.$insert({ data: accountData });
    Wallet.$insert({ data: walletData });

    wrapper = wrapperInit({
      i18n,
      router,
      localVue,
      propsData,
      parentComponent,
      store: storeMocks.store,
      mocks: {
        errorHandler: jest.fn(),
      },
    });
  }

  beforeEach(() => { storeInit({}, defaultProps); });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  describe('methods', () => {
    describe('decrypt()', () => {
      it('decrypts a value', () => {
        const string = 'just a string';
        const password = 'pass';
        const encrypted = AES.encrypt(JSON.stringify(string), password).toString();

        const decrypted = wrapper.vm.decrypt(encrypted, password);
        expect(string === decrypted).toBe(true);
      });
    });

    describe('getSalt()', () => {
      it('returns a salt string', () => {
        const result = wrapper.vm.getSalt();
        expect(typeof result).toBe('string');
      });
    });

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
      it('stores the pin, changes PinPad mode and resets the PinPad state; if valid pin was entered', () => {
        wrapper.vm.$toast.create = jest.fn();
        const resetStateMock = jest.fn();
        wrapper.vm.$refs.PinPad = {
          resetState: resetStateMock,
        };

        const resetPinMock = jest.fn();
        wrapper.setMethods({ resetPin: resetPinMock });

        wrapper.vm.pin = [1, 2, 3, 4, 5, 6, 7, 8];
        wrapper.vm.attemptUnlock();

        expect(resetStateMock).toHaveBeenCalledTimes(0);
        expect(resetPinMock).toHaveBeenCalledTimes(0);

        wrapper.vm.pin = [0, 0, 0, 0, 0, 0];
        wrapper.vm.attemptUnlock();

        expect(wrapper.vm.oldPin).toBe(wrapper.vm.pin);
        expect(wrapper.vm.authorized).toBe(true);
        expect(resetStateMock).toHaveBeenCalled();
        expect(resetPinMock).toHaveBeenCalled();
        expect(wrapper.vm.mode).toBe('new-pin');
      });
    });

    describe('closeModal()', () => {
      it('emits closePinModal event and resets state', () => {
        wrapper.vm.pin = [1, 2, 3, 4, 5, 6, 7, 8];
        const resetStateMock = jest.fn();
        wrapper.vm.$refs.PinPad = {
          resetState: resetStateMock,
        };

        const resetPinMock = jest.fn();
        wrapper.setMethods({ resetPin: resetPinMock });

        wrapper.vm.closeModal();

        expect(resetStateMock).toHaveBeenCalled();
        expect(resetPinMock).toHaveBeenCalled();
        expect(wrapper.vm.pin.length).toBe(0);
        expect(wrapper.emitted().closePinModal).toBeTruthy();
      });
    });

    describe('storeNewPin()', () => {
      it('saves the new PIN, resets the state and changes the mode', () => {
        const pin = [1, 2, 3, 4, 5, 6, 7, 8];
        wrapper.vm.pin = pin;
        const resetStateMock = jest.fn();
        wrapper.vm.$refs.PinPad = {
          resetState: resetStateMock,
        };

        const resetPinMock = jest.fn();
        wrapper.setMethods({ resetPin: resetPinMock });

        wrapper.vm.storeNewPin();
        expect(wrapper.vm.newPin).toBe(pin);
        expect(wrapper.vm.newPinHash).toBeTruthy();
        expect(wrapper.vm.newPinConfirmed).toBe(true);
        expect(resetStateMock).toHaveBeenCalled();
        expect(resetPinMock).toHaveBeenCalled();
        expect(wrapper.vm.mode).toBe('confirm-new-pin');
      });
    });

    describe('encryptPersistentData()', () => {
      it('ecrypts wallets hdWallet property with the new pin', async (done) => {
        wrapper.vm.newPin = [0, 0, 0, 0, 0, 0];
        wrapper.vm.oldPin = [0, 0, 0, 0, 0, 0];
        wrapper.vm.newPinHash = 'somestring';
        await wrapper.vm.encryptPersistentData();
        done();
      });
    });

    describe('updateAccount()', () => {
      it('updates the account and completes the PIN change process', async (done) => {
        const resetStateMock = jest.fn();
        wrapper.vm.$refs.PinPad = {
          resetState: resetStateMock,
        };

        const resetPinMock = jest.fn();
        const closeModalMock = jest.fn();
        wrapper.setMethods({
          resetPin: resetPinMock,
          closeModal: closeModalMock,
        });

        wrapper.setMethods({
          encryptPersistentData: jest.fn(),
        });

        wrapper.vm.pin = [1, 1, 1, 1, 1, 1];
        wrapper.vm.newPinHash = '$2a$10$Co3TywEQpmVAsS78YQt6P.ngZF.KKRhAt9ZFlYi9U0SA5sonr9bEO';

        wrapper.vm.updateAccount();

        setTimeout(() => {
          expect(resetPinMock).toHaveBeenCalled();
          expect(closeModalMock).toHaveBeenCalled();
          expect(resetStateMock).toHaveBeenCalled();
          expect(wrapper.vm.encryptPersistentData).toHaveBeenCalled();
          done();
        }, 100);
      });

      it('displays the toast if PINs do not match', async (done) => {
        const createMock = jest.fn();
        wrapper.vm.$toast.create = createMock;

        wrapper.vm.pin = [3, 1, 1, 1, 1, 1];
        wrapper.vm.newPinHash = '$2a$10$Co3TywEQpmVAsS78YQt6P.ngZF.KKRhAt9ZFlYi9U0SA5sonr9bEO';

        await wrapper.vm.updateAccount();
        expect(createMock).toHaveBeenCalled();
        done();
      });
    });
  });
});
