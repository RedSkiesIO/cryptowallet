import { shallowMount, mount } from '@vue/test-utils';
import ContactsList from '@/components/Wallet/Payments/ContactsList.vue';
import ContactListItem from '@/components/Wallet/Payments/ContactListItem.vue';
import { localVue, i18n } from '../../../../helpers/setupLocalVue';
import { __createMocks as createStoreMocks } from '../../../../../store/__mocks__/store.js';

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
    expect(wrapper.findAll(ContactListItem).length).toBeGreaterThan(1);
  });

  it('adds the .isSearchingContacts class if the store has payments.isSearchingContacts === true ', () => {
    expect(store.state.payments.isSearchingContacts).toBe(false);
    expect(wrapper.contains('section.contacts-list.isSearchingContacts')).toBe(false);
    store.state.payments.isSearchingContacts = true;
    expect(wrapper.contains('section.contacts-list.isSearchingContacts')).toBe(true);
    store.state.payments.isSearchingContacts = false;
  });

  it('filters the contacts if store has payments.searchingContactsQueryString', () => {
    wrapper = mount(ContactsList, { i18n, localVue, store: storeMocks.store });
    expect(store.state.wallet.contacts.length === wrapper.findAll(ContactListItem).length).toBe(true);
    store.state.payments.searchingContactsQueryString = 'pseudorandomstring';
    expect(wrapper.findAll(ContactListItem).length).toBe(0);
    store.state.payments.searchingContactsQueryString = 'fio';
    expect(wrapper.findAll(ContactListItem).length).toBe(1);
    expect(wrapper.findAll(ContactListItem).at(0).html().toLowerCase().includes('fio')).toBe(true);
  });
});
