import { shallowMount } from '@vue/test-utils';
import Name from '@/components/Contacts/Name';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';

describe('Name.vue', () => {
  let storeMocks;
  let wrapper;
  let store;
  let router;

  function wrapperInit(options) {
    return shallowMount(Name, options);
  }

  function storeInit(custom) {
    storeMocks = createStoreMocks(custom);
    router = createRouter(storeMocks.store);
    router.push({ path: `/contact/1` });
    wrapper = wrapperInit({ router, localVue, store: storeMocks.store, i18n });
    store = wrapper.vm.$store;
  }

  beforeEach(() => storeInit());

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('displays the contacts displayName based on the URL param { id }', () => {
    const displayName = store.state.contacts.contacts.find(contact => contact.id === 1).displayName;
    expect(wrapper.html().includes(displayName)).toBe(true);
  });
});
