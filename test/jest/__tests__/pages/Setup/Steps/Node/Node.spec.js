/*eslint-disable*/
import { mount } from '@vue/test-utils';
import Splash from '@/pages/Setup/Steps/Splash';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';

describe('Splash Setup', () => {
  let wrapper;
  let router;
  let store;
  let storeMocks;

  const propsData = {};

  function wrapperInit(options) {
    return mount(Splash, options);
  }

  function storeInit(custom) {
    storeMocks = createStoreMocks(custom);
    router = createRouter(storeMocks.store);
    router.push({ path: '/setup/0' });
    wrapper = wrapperInit({
      i18n,
      router,
      localVue,
      propsData,
      store: storeMocks.store,
    });
    store = wrapper.vm.$store;
  }

  beforeEach(() => { storeInit(); });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

});
