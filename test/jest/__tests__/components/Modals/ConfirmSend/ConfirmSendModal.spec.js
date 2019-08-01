/* eslint-disable no-magic-numbers */
import { shallowMount } from '@vue/test-utils';
import ConfirmSendModal from '@/components/Modals/ConfirmSend';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';

describe('ConfrimSendModal.vue', () => {
  let storeMocks;
  let wrapper;
  let router;

  function wrapperInit(options) {
    return shallowMount(ConfirmSendModal, options);
  }

  function storeInit(custom) {
    storeMocks = createStoreMocks(custom);
    router = createRouter(storeMocks.store);
    router.push({ path: '/' });
    wrapper = wrapperInit({
      i18n, router, localVue, store: storeMocks.store,
    });
  }

  beforeEach(() => { return storeInit(); });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('opens and closes modal on route change', () => {
    wrapper.vm.sendConfirmModalOpened = true;
    expect(storeMocks.actions.setConfirmSendModalOpened.mock.calls[0][1]).toBe(true);
    wrapper.vm.sendConfirmModalOpened = false;
    expect(storeMocks.actions.setConfirmSendModalOpened.mock.calls[1][1]).toBe(false);
  });
});
