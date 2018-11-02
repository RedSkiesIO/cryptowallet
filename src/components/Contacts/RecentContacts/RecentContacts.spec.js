import { shallowMount } from '@vue/test-utils';
import RecentContacts from '@/components/Contacts/RecentContacts';
import RecentContactItem from '@/components/Contacts/RecentContactItem';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';

describe('RecentContacts.vue', () => {
  let storeMocks;
  let wrapper;
  let store;

  function wrapperInit (options) {
    return shallowMount(RecentContacts, options);
  }

  function storeInit (custom) {
    storeMocks = createStoreMocks(custom);
    wrapper = wrapperInit({ i18n, localVue, store: storeMocks.store });
    store = wrapper.vm.$store;
  }

  beforeEach(() => storeInit());

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('renders a section with .recent-contacts-list class', () => {
    expect(wrapper.contains('section.recent-contacts-list')).toBe(true);
  });

  it('is hidden if store has search.isSearchingContacts === true', () => {
    expect(store.state.search.isSearchingContacts).toBe(false);
    expect(wrapper.isVisible()).toBe(true);
    store.state.search.isSearchingContacts = true
    expect(wrapper.isVisible()).toBe(false);
  });

  it('renders a h1 with .section-h1 class that contains "Recent" string', () => {
    expect(wrapper.find('h1.section-h1').html().includes('Recent')).toBe(true);
  });

  it('loops through the data and renders multiple RecentContactItem components', () => {
    expect(wrapper.findAll(RecentContactItem).length).toBeGreaterThan(1);
  });
});
