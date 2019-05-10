/* eslint-disable no-magic-numbers */
import { mount } from '@vue/test-utils';
import NewAccount from '@/components/Modals/NewAccount/NewAccountContent';
import NewAccountModal from '@/components/Modals/NewAccount';

import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';

describe('NewModalContent component', () => {
  let wrapper;
  let router;
  let storeMocks;

  const defaultProps = {};

  function wrapperInit(options) {
    return mount(NewAccount, options);
  }

  function storeInit(custom, propsData) {
    storeMocks = createStoreMocks(custom);
    router = createRouter(storeMocks.store);
    router.push({ path: '/' });
    wrapper = wrapperInit({
      i18n,
      router,
      localVue,
      propsData,
      parentComponent: NewAccountModal,
      store: storeMocks.store,
    });
  }

  beforeEach(() => { storeInit({}, defaultProps); });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('renders create account and import account buttons', () => {
    expect(wrapper.findAll('button').at(1).text()).toMatch('Create Account');
    expect(wrapper.findAll('button').at(2).text()).toMatch('Import Account');
  });

  it('back button closes the modal', () => {
    wrapper.findAll('button').at(0).trigger('click');
    expect(storeMocks.actions.setNewAccountModalOpened).toHaveBeenCalled();
  });

  it('create account button closes modals and routes /setup/2', () => {
    wrapper.findAll('button').at(1).trigger('click');
    expect(storeMocks.actions.setNewAccountModalOpened).toHaveBeenCalled();
    expect(storeMocks.actions.setSelectAccountModalOpened).toHaveBeenCalled();
    expect(storeMocks.actions.setAccountType.mock.calls[0][1]).toBe('new');
    expect(router.history.current.path).toBe('/setup/2');
  });

  it('import account button closes modals and routes /setup/1', () => {
    wrapper.findAll('button').at(2).trigger('click');
    expect(storeMocks.actions.setNewAccountModalOpened).toHaveBeenCalled();
    expect(storeMocks.actions.setSelectAccountModalOpened).toHaveBeenCalled();
    expect(storeMocks.actions.setAccountType.mock.calls[1][1]).toBe('restored');
    expect(router.history.current.path).toBe('/setup/1');
  });

  describe('parent modal', () => {
    it('opens and closes the modal', () => {
      wrapper.vm.$parent.$store = wrapper.vm.$store;
      wrapper.vm.$parent.newAccountModalOpened = false;
      expect(wrapper.vm.$parent.newAccountModalOpened).toBe(false);
      expect(storeMocks.actions.setNewAccountModalOpened.mock.calls[3][1]).toBe(false);
      wrapper.vm.$parent.newAccountModalOpened = true;
      expect(storeMocks.actions.setNewAccountModalOpened.mock.calls[4][1]).toBe(true);
    });
  });
});
