import { shallowMount, mount } from '@vue/test-utils';
import ContactsList from '@/components/Contacts/ContactsList';
import ContactListItem from '@/components/Contacts/ContactListItem';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';

describe('ContactsList.vue', () => {
  let storeMocks;
  let wrapper;
  let store;

  function wrapperInit (options) {
    return shallowMount(ContactsList, options);
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

  it('renders a section with .contacts-list class', () => {
    expect(wrapper.contains('section.contacts-list')).toBe(true);
  });

  it('renders a h1 with .section-h1 class that contains "Contacts" string', () => {
    expect(wrapper.find('h1.section-h1').html().includes('Contacts')).toBe(true);
  });

  it('loops through the data and renders multiple ContactListItem components', () => {
    expect(wrapper.findAll(ContactListItem).length).toBeGreaterThan(0);
  });

  it('adds the .isSearchingContacts class if store has search.isSearchingContacts === true ', () => {
    expect(store.state.search.isSearchingContacts).toBe(false);
    expect(wrapper.contains('section.contacts-list.isSearchingContacts')).toBe(false);
    store.state.search.isSearchingContacts = true;
    expect(wrapper.contains('section.contacts-list.isSearchingContacts')).toBe(true);
    store.state.search.isSearchingContacts = false;
  });

  it('filters the contacts if store has search.searchingContactsQueryString', () => {
    wrapper = mount(ContactsList, { i18n, localVue, store: storeMocks.store });
    expect(store.state.contacts.contacts.length === wrapper.findAll(ContactListItem).length).toBe(true);
    store.state.search.searchingContactsQueryString = 'pseudorandomstring';
    expect(wrapper.findAll(ContactListItem).length).toBe(0);
    store.state.search.searchingContactsQueryString = 'Te';
    expect(wrapper.findAll(ContactListItem).length).toBe(1);
    expect(wrapper.findAll(ContactListItem).at(0).html().toLowerCase().includes('te')).toBe(true);
  });
});
