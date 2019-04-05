import { shallowMount, mount } from '@vue/test-utils';
import SearchContacts from '@/components/Contacts/SearchContacts';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';

describe('SearchContacts.vue', () => {
  let storeMocks;
  let wrapper;
  let store;

  function wrapperInit (options) {
    return shallowMount(SearchContacts, options);
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

  it('renders a section with .search-contacts class', () => {
    expect(wrapper.contains('section.search-contacts')).toBe(true);
  });

  it('renders an input', () => {
    expect(wrapper.contains('qinput-stub')).toBe(true);
  });

  it('displays input value using stores state search.searchingContactsQueryString', () => {
    wrapper = mount(SearchContacts, { i18n, localVue, store: storeMocks.store, sync: false });
    store.state.search.searchingContactsQueryString = 'hello there';
    localVue.nextTick(() => {
      expect(wrapper.find('input').element.value).toBe('hello there');
    });
  });

  it('dispatches search/updateSearchContactsQueryString with correct value on input change', () => {
    wrapper = mount(SearchContacts, { i18n, localVue, store: storeMocks.store });
    wrapper.find('input').setValue('test value');
    expect(storeMocks.actions.updateSearchContactsQueryString).toHaveBeenCalled();
    expect(storeMocks.actions.updateSearchContactsQueryString.mock.calls[0][1].value === 'test-value');
  });

  it('dispatches search/updateIsSearchingContacts with value true on input focus', () => {
    wrapper = mount(SearchContacts, { i18n, localVue, store: storeMocks.store });
    wrapper.find('input').trigger('focus');
    expect(storeMocks.actions.updateIsSearchingContacts).toHaveBeenCalled();
    expect(storeMocks.actions.updateIsSearchingContacts.mock.calls[0][1].value === true);
  });

  it('dispatches search/updateIsSearchingContacts with value false on input blur', () => {
    wrapper = mount(SearchContacts, { i18n, localVue, store: storeMocks.store });
    wrapper.find('input').trigger('blur');
    expect(storeMocks.actions.updateIsSearchingContacts).toHaveBeenCalled();
    expect(storeMocks.actions.updateIsSearchingContacts.mock.calls[0][1].value === false);
  });

  it('shows the cancel button if store has search/isSearchingContacts === true', () => {
    expect(store.state.search.isSearchingContacts).toBe(false);
    expect(wrapper.find('.cancel-search-wrapper').isVisible()).toBe(false);
    store.state.search.isSearchingContacts = true;
    expect(wrapper.find('.cancel-search-wrapper').isVisible()).toBe(true);

  });

  it('dispatches correct actions on the cancel button click', () => {
    wrapper = mount(SearchContacts, { i18n, localVue, store: storeMocks.store, sync: false });
    store.state.search.isSearchingContacts = true;
    wrapper.find('.cancel-search-wrapper button').trigger('click');
    expect(storeMocks.actions.updateIsSearchingContacts).toHaveBeenCalled();
    expect(storeMocks.actions.updateIsSearchingContacts.mock.calls[0][1].value === false);
    expect(storeMocks.actions.updateSearchContactsQueryString).toHaveBeenCalled();
    expect(storeMocks.actions.updateSearchContactsQueryString.mock.calls[0][1].value === '');
  });
});
