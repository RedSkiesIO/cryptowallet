/* eslint-disable no-magic-numbers */
import { shallowMount } from '@vue/test-utils';
import AccountSettings from '@/components/AccountSettings';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';
import Account from '@/store/wallet/entities/account';
import Wallet from '@/store/wallet/entities/wallet';

const accountData = JSON.parse('{"$id":1,"id":1,"uid":"62b49f90-d795-bea0-7cdf-5c7a7f18d2e3","refresh_token":"U2FsdGVkX1+SrO40Mx8VS2EHhvK2/X3G25XK4+jsH2fgzG9IuCuEHR7ckI57DNe1riwz7lNafU1ecQFezy/Ov1W98Fg2dPHJBV8GGgadEbLsGxOVoe0d8L+05yALcWWaumNnMYIearOs/AMqhZkuwMTM16jtsgyIxgqFYPsXzAqdMI/V1rdh5Wjtkb1ZQQ2s5SBBAkWUFB6yr92ACebzF5TCkRLGlJqBQpAPNEwtMh4TI+rRHFqo9SBDrCoElQGGIq7mhEmhkmv+CKPQX1eD6Q==","salt":"$2a$10$8NJPPf3O6RY3UI98PjOYou","pinHash":"$2a$10$8NJPPf3O6RY3UI98PjOYouYOfeDyVVKD4cPqefFJHmqkhsLwTfEZC","name":"Konrad","locale":"en-gb","currency":"GBP","node":null,"default":true,"seed":"U2FsdGVkX19WR8fHv2QN8AN9s95N/QNMPvTCCas0AUgcsnJGC4El5Y54Y+0R2dNp0cwbaBypbQ/VhPay5WD1cYzIMMZPoknXHEYnvVPbMChRksNc+VyBt6bTriQcDak0bSREJdrqwQX7JDClECKXQWF5w7eMDf1RLgs/cOfSCYI=","wallets":[]}');
const walletData = JSON.parse('{"$id":3,"id":3,"account_id":1,"name":"Bitcoin","displayName":"Bitcoin","symbol":"BTC","sdk":"Bitcoin","network":"BITCOIN_TESTNET","internalChainAddressIndex":0,"externalChainAddressIndex":1,"externalAddress":null,"confirmedBalance":0,"unconfirmedBalance":0,"imported":true,"enabled":true,"lastBlockHeight":0,"parentName":"","parentSdk":"","contractAddress":"","decimals":"","hdWallet":{"bip":49,"ext":{"xpriv":"xprv9zZZrtcYB6bg2sxhoVYYKAM8duZHP1MwV1SYNVLStU6qpY6NCKfuTCeeHe1MsBeYDt7XipqZYtshoGC9ghNZ6EVwugKxUPM7m2tFmExu2mt","xpub":"xpub6DYvGQ9S1U9yFN3AuX5YgJHsBwPmnU5nrEN9Ask4SodphLRWjrz9zzy88v6HFPGJuDoMg7hhEG2yFFhU7Djqx3AoE57hEL748iFp26JLXtC"},"int":{"xpriv":"xprv9zZZrtcYB6bg6LXLr8kweVuqCWUTc5dnFDJ526bEyz5pLHdfHRx2D1UPLE8bZy6hK8f1YpXQHeGF2FWEds5S1MSbTH2boaQRNUoz6vy4MRq","xpub":"xpub6DYvGQ9S1U9yJpboxAHx1drZkYJx1YMdcSDfpUzrYKcoD5xopyGGkonsBXbmCnHteYYMcjgWRU7EyByaGf8Mav4y5BTkYmC2TD2JVPmkJxs"},"type":1,"network":{"name":"BITCOIN_TESTNET","type":"testnet","bip":1,"segwit":true,"discovery":"http://92.207.178.198:3001/api","broadcastUrl":"https://chain.so/api/v2/send_tx/BTCTEST","feeApi":"https://api.blockcypher.com/v1/btc/main","connect":{"messagePrefix":"Bitcoin Signed Message:","bech32":"tb","bip32":{"public":70617039,"private":70615956},"pubKeyHash":111,"scriptHash":196,"wif":239}}},"erc20Wallet":""}');

describe('AccountSettings component', () => {
  let wrapper;
  let router;
  let store;
  let storeMocks;

  const defaultProps = {};

  function wrapperInit(options) {
    return shallowMount(AccountSettings, options);
  }

  function storeInit(custom, propsData, parentComponent = null) {
    storeMocks = createStoreMocks(custom);
    router = createRouter(storeMocks.store);
    router.push({ path: '/settings' });

    Account.insert({ data: accountData });
    Wallet.insert({ data: walletData });

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
    store = wrapper.vm.$store;
  }

  beforeEach(() => { storeInit({}, defaultProps); });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  describe('logout() method', () => {
    it('performs all the necessery actions when called', async (done) => {
      Wallet.$find = jest.fn().mockImplementationOnce(() => {
        return [{ hdWallet: 'high definition' }];
      });

      await wrapper.vm.logout();

      setTimeout(() => {
        expect(storeMocks.actions.setLoading.mock.calls[0][1]).toBe(true);
        expect(storeMocks.actions.setLayout.mock.calls[0][1]).toBe('dark');
        expect(store.state.route.path).toBe('/');
        expect(storeMocks.actions.setAuthenticatedAccount.mock.calls[0][1]).toBe(null);
        expect(storeMocks.actions.setLoading.mock.calls[1][1]).toBe(false);

        const wallets = Wallet.query().where('account_id', accountData.id).get();
        wallets.forEach((item) => {
          expect(item.hdWallet).toBe('high definition');
        });

        done();
      }, 100);
    });

    describe('passes the errors to errorHandler', () => {
      it('passes it if the error happens specifically within a promise', async (done) => {
        Wallet.$find = jest.fn().mockImplementationOnce(() => {
          throw new Error();
        });

        wrapper.vm.logout();

        setTimeout(() => {
          expect(wrapper.vm.errorHandler).toHaveBeenCalled();
          wrapper.vm.errorHandler.mockClear();
          done();
        }, 250);
      });

      it('passes it if the error happens within method body', async (done) => {
        Wallet.query = jest.fn().mockImplementationOnce(() => {
          throw new Error();
        });

        wrapper.vm.logout();

        setTimeout(() => {
          expect(wrapper.vm.errorHandler).toHaveBeenCalled();
          wrapper.vm.errorHandler.mockClear();
          done();
        }, 250);
      });
    });
  });
});
