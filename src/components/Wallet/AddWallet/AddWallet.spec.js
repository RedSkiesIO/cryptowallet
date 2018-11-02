import { mount } from '@vue/test-utils';
import AddWallet from '@/components/Wallet/AddWallet';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';

describe('AddWallet.vue', () => {
  let storeMocks;
  let wrapper;
  let store;

  function wrapperInit (options) {
    return mount(AddWallet, options);
  }

  function storeInit (custom) {
    storeMocks = createStoreMocks(custom);
    wrapper = wrapperInit({ localVue, i18n, store: storeMocks.store });
    store = wrapper.vm.$store;
  }

  beforeEach(() => storeInit());

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('renders an "Add Wallet" button', () => {
    expect(wrapper.find('button').html().includes('Add Wallet')).toBe(true);
  });

  it('calls the addWallet method on "Add Wallet" button click', () => {
    const addWalletMock = jest.fn();
    wrapper.setMethods({addWallet: addWalletMock});
    wrapper.find('button').trigger('click');
    expect(addWalletMock).toBeCalledTimes(1);
  });
});
