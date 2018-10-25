import { shallowMount } from '@vue/test-utils';
import UnAuthed from '@/layouts/UnAuthed.vue';
import { localVue, i18n, createRouter } from '@/../tests/unit/helpers/setupLocalVue.js';
import { __createMocks as createStoreMocks } from '@/../tests/store/__mocks__/store.js';

describe('UnAuthed.vue', () => {
  let storeMocks;
  let wrapper;
  let store;
  let router;

  function wrapperInit (options) {
    return shallowMount(UnAuthed, options);
  }

  function storeInit (custom) {
    storeMocks = createStoreMocks(custom);
    router = createRouter(storeMocks.store);
    router.push({ path: `/` });
    wrapper = wrapperInit({ i18n, router, localVue, store: storeMocks.store });
    store = wrapper.vm.$store;
  }

  beforeEach(() => storeInit());

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('renders a router-view component', () => {
    expect(wrapper.contains('router-view-stub')).toBe(true);
  });
});
