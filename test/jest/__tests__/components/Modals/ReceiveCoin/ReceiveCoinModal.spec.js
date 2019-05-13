/* eslint-disable no-magic-numbers */
import { shallowMount } from '@vue/test-utils';
import ReceiveCoinModal from '@/components/Modals/ReceiveCoin';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';

describe('ReceiveCoinModal.vue', () => {
  let storeMocks;
  let wrapper;
  let router;

  function wrapperInit(options) {
    return shallowMount(ReceiveCoinModal, options);
  }

  function storeInit(custom) {
    storeMocks = createStoreMocks(custom);
    router = createRouter(storeMocks.store);
    router.push({ path: '/wallet/prices/1' });
    wrapper = wrapperInit({
      i18n, router, localVue, store: storeMocks.store,
    });
  }

  beforeEach(() => { return storeInit(); });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('opens and closes modal on route change', () => {
    wrapper.vm.receiveCoinModalOpened = true;
    router.push({ path: '/wallet' });
    expect(storeMocks.actions.setReceiveCoinModalOpened.mock.calls[1][1]).toBe(false);
    router.push({ path: '/wallet/single/receive/1' });
    expect(storeMocks.actions.setReceiveCoinModalOpened.mock.calls[2][1]).toBe(true);
  });

  it('goes to previous route when modal is closed', (done) => {
    wrapper.vm.$store.state.modals.receiveCoinModalOpened = true;
    router.push({ path: '/wallet' });
    router.push({ path: '/wallet/single/receive/1' });
    wrapper.vm.$store.state.modals.receiveCoinModalOpened = false;
    setTimeout(() => {
      expect(router.history.current.path).toBe('/wallet');
      wrapper.vm.$store.state.modals.receiveCoinModalOpened = true;
      wrapper.vm.$store.state.modals.receiveCoinModalOpened = false;
      done();
    }, 500);
  });
});
