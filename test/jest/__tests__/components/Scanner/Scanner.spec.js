import { mount } from '@vue/test-utils';
import Scanner from '@/components/Scanner';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';

describe('Scanner.vue', () => {
  let storeMocks;
  let wrapper;
  let router;

  function wrapperInit(options) {
    return mount(Scanner, options);
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

  it('cancels scanning when cancel button is pressed', () => {
    wrapper.find('button').trigger('click');
    expect(storeMocks.actions.cancelScanning).toHaveBeenCalled();
  });
});
