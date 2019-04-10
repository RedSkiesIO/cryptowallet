import { mount } from '@vue/test-utils';
import SendFailure from '@/components/Modals/SendFailure';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';

describe('SendFailure component', () => {
  let wrapper;
  let router;
  let storeMocks;

  const delay = 50;

  const defaultProps = {};

  function wrapperInit(options) {
    return mount(SendFailure, options);
  }

  function storeInit(custom, propsData, parentComponent = null) {
    storeMocks = createStoreMocks(custom);
    router = createRouter(storeMocks.store);
    router.push({ path: '/' });
    wrapper = wrapperInit({
      i18n,
      router,
      localVue,
      propsData,
      parentComponent,
      store: storeMocks.store,
    });
  }

  beforeEach(() => { storeInit({}, defaultProps); });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('closes the modal when dismiss() method is called', async (done) => {
    wrapper.vm.dismiss();

    setTimeout(() => {
      expect(storeMocks.actions.setSendFailureModalOpened.mock.calls[0][1]).toBe(false);
      done();
    }, delay);
  });
});
