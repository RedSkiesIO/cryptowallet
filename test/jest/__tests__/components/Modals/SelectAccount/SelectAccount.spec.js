/* eslint-disable no-magic-numbers */
import { mount } from '@vue/test-utils';
import SelectAccount from '@/components/Modals/SelectAccount/SelectAccountContent';
import SelectAccountModal from '@/components/Modals/SelectAccount';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';
import Account from '@/store/wallet/entities/account.js';

describe('SelectAccountuModalContent component', () => {
  let wrapper;
  let router;
  let storeMocks;

  const mockAccounts = [{ name: 'Account1', default: true }, { name: 'Account2', default: false }, { name: 'Account3', default: false }];
  const defaultProps = {};

  function wrapperInit(options) {
    return mount(SelectAccount, options);
  }

  function storeInit(custom, propsData) {
    storeMocks = createStoreMocks(custom);
    Account.insert({ data: mockAccounts });
    router = createRouter(storeMocks.store);
    router.push({ path: '/' });
    wrapper = wrapperInit({
      i18n,
      router,
      localVue,
      propsData,
      parentComponent: SelectAccountModal,
      store: storeMocks.store,
    });
  }

  beforeEach(() => { storeInit({}, defaultProps); });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('renders three account items', () => {
    expect(wrapper.findAll('.account-item').length).toBe(3);
  });

  it('closes the modal when the back button is clicked', () => {
    wrapper.findAll('button').at(0).trigger('click');
    expect(storeMocks.actions.setSelectAccountModalOpened.mock.calls[0][1]).toBe(false);
  });

  it('opens the new account modal when the new account icon is clicked', () => {
    wrapper.findAll('button').at(1).trigger('click');
    expect(storeMocks.actions.setNewAccountModalOpened.mock.calls[0][1]).toBe(true);
  });

  it('changes selected account on account-item click', () => {
    wrapper.findAll('.account-item').at(2).trigger('click');
    expect(storeMocks.actions.setSelectedAccount.mock.calls[0][1]).toBe('Account3');
    wrapper.findAll('.account-item').at(0).trigger('click');
    expect(storeMocks.actions.setSelectedAccount.mock.calls[1][1]).toBe('Account1');
  });

  it('changes default account on account-item default toggle', (done) => {
    Account.$update = Account.update;
    expect(Account.all()[0].default).toBe(true);
    expect(Account.all()[1].default).toBe(false);
    wrapper.findAll('.q-toggle').at(1).trigger('click');
    expect(Account.all()[1].default).toBe(true);
    expect(Account.all()[0].default).toBe(false);
    setTimeout(() => {
      wrapper.findAll('.q-toggle__inner').at(1).trigger('click');
      done();
    }, 0);
  });

  describe('parent modal', () => {
    it('opens and closes the modal', () => {
      wrapper.vm.$parent.$store = wrapper.vm.$store;
      wrapper.vm.$parent.selectAccountModalOpened = false;
      expect(wrapper.vm.$parent.selectAccountModalOpened).toBe(false);
      expect(storeMocks.actions.setSelectAccountModalOpened.mock.calls[3][1]).toBe(false);
      wrapper.vm.$parent.selectAccountModalOpened = true;
      expect(storeMocks.actions.setSelectAccountModalOpened.mock.calls[4][1]).toBe(true);
    });
  });
});
