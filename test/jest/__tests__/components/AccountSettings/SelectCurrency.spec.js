/* eslint-disable no-magic-numbers */
import { shallowMount } from '@vue/test-utils';
import SelectCurrency from '@/components/AccountSettings/SelectCurrency.vue';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';
import Account from '@/store/wallet/entities/account';
import Wallet from '@/store/wallet/entities/wallet';

const accountData = JSON.parse('{"$id":1,"id":1,"uid":"62b49f90-d795-bea0-7cdf-5c7a7f18d2e3","refresh_token":"U2FsdGVkX1+SrO40Mx8VS2EHhvK2/X3G25XK4+jsH2fgzG9IuCuEHR7ckI57DNe1riwz7lNafU1ecQFezy/Ov1W98Fg2dPHJBV8GGgadEbLsGxOVoe0d8L+05yALcWWaumNnMYIearOs/AMqhZkuwMTM16jtsgyIxgqFYPsXzAqdMI/V1rdh5Wjtkb1ZQQ2s5SBBAkWUFB6yr92ACebzF5TCkRLGlJqBQpAPNEwtMh4TI+rRHFqo9SBDrCoElQGGIq7mhEmhkmv+CKPQX1eD6Q==","salt":"$2a$10$8NJPPf3O6RY3UI98PjOYou","pinHash":"$2a$10$8NJPPf3O6RY3UI98PjOYouYOfeDyVVKD4cPqefFJHmqkhsLwTfEZC","name":"Konrad","locale":"en-gb","currency":"GBP","node":null,"default":true,"seed":"U2FsdGVkX19WR8fHv2QN8AN9s95N/QNMPvTCCas0AUgcsnJGC4El5Y54Y+0R2dNp0cwbaBypbQ/VhPay5WD1cYzIMMZPoknXHEYnvVPbMChRksNc+VyBt6bTriQcDak0bSREJdrqwQX7JDClECKXQWF5w7eMDf1RLgs/cOfSCYI=","wallets":[]}');

describe('SelectCurrency component', () => {
  let wrapper;
  let router;
  let storeMocks;

  const defaultProps = {
    open: true,
    currentCurrency: 'GBP',
  };

  const mockBackEndService = {
    loadCoinPriceData: jest.fn(),
  };

  function wrapperInit(options) {
    return shallowMount(SelectCurrency, options);
  }

  function storeInit(custom, propsData, parentComponent = null) {
    storeMocks = createStoreMocks(custom);
    router = createRouter(storeMocks.store);
    router.push({ path: '/settings' });

    Account.$insert({ data: accountData });
    Wallet.$insert({ data: [{ account_id: 1, imported: true, symbol: 'BTC' }, { account_id: 1, imported: true, symbol: 'ETH' }, { account_id: 1, imported: true, symbol: 'LTC' }] });

    wrapper = wrapperInit({
      i18n,
      router,
      localVue,
      propsData,
      parentComponent,
      store: storeMocks.store,
      mocks: {
        backEndService: mockBackEndService,
      },
    });
  }

  beforeEach(() => { storeInit({}, defaultProps); });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  describe('computed', () => {
    describe('selectedCurrency', () => {
      it('updates the account and the store on change', () => {
        Account.$update = Account.update;
        wrapper.vm.selectedCurrency = 'USD';
        expect(Account.all()[0].currency).toBe('USD');
        expect(storeMocks.actions.setCurrency).toHaveBeenCalled();
      });
    });
  });

  describe('methods', () => {
    describe('closeModal()', () => {
      it('loads the coin price data for the new currency', (done) => {
        wrapper.vm.closeModal();
        setTimeout(() => {
          expect(mockBackEndService.loadCoinPriceData).toHaveBeenCalledTimes(3);
          done();
        }, 0);
      });

      it('closes the modal', () => {
        wrapper.vm.closeModal();
        expect(storeMocks.actions.setSelectCurrencyModalOpened).toHaveBeenCalled();
      });
    });
  });
});
