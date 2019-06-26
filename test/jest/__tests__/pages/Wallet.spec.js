import { shallowMount } from '@vue/test-utils';
import Wallet from '@/pages/Wallet';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';

describe('Wallet.vue', () => {
  let router;
  let wrapper;
  let storeMocks;

  const customStore = {};

  const propsData = {};

  function wrapperInit(options) {
    return shallowMount(Wallet, options);
  }

  function storeInit(custom) {
    storeMocks = createStoreMocks(custom);
    router = createRouter(storeMocks.store);
    router.push({ path: '/' });
    wrapper = wrapperInit({
      i18n,
      router,
      localVue,
      propsData,
      store: storeMocks.store,
    });
  }

  beforeEach(() => { storeInit(customStore); });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('displays a exit dialog when routing to /', () => {
    const next = jest.fn();
    wrapper.vm.$options.beforeRouteLeave[0]({ path: '/settings' }, { path: '/wallet' }, next);
    expect(next).toHaveBeenCalledWith();

    wrapper.vm.$options.beforeRouteLeave[0]({ path: '/' }, { path: '/wallet' }, next);
    expect(next).toHaveBeenCalledWith(false);
  });

  it('it exits the app if user accepts dialog', () => {
    const mockExitApp = jest.fn();
    global.navigator.app = { exitApp: mockExitApp };
    wrapper.vm.exit();
    expect(mockExitApp).toHaveBeenCalled();
  });
});
