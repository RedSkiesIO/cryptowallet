import { shallowMount } from '@vue/test-utils';
import ContactListItem from '@/components/Wallet/Payments/ContactListItem.vue';
import { localVue, i18n, createRouter } from '@/../tests/unit/helpers/setupLocalVue.js';
import { __createMocks as createStoreMocks } from '@/../tests/store/__mocks__/store.js';

describe('ContactListItem.vue', () => {
  let storeMocks;
  let wrapper;
  let store;
  let router;

  const propsData = {
    contact: {
      id: 1,
      displayName: 'Fio',
      address: '1CK6KHY6MHgYvmRQ4PAafKYDrg1ejbH1cE',
    }
  };

  function wrapperInit (options) {
    return shallowMount(ContactListItem, options);
  }

  function storeInit (custom) {
    storeMocks = createStoreMocks(custom);
    router = createRouter(storeMocks.store);
    router.push({ path: `/` });
    wrapper = wrapperInit({ i18n, router, localVue, store: storeMocks.store, propsData });
    store = wrapper.vm.$store;
  }

  beforeEach(() => storeInit());

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('renders a div with .contact-list-item class', () => {
    expect(wrapper.contains('div.contact-list-item')).toBe(true);
  });

  it('renders contacts displayName', () => {
    expect(wrapper.html().includes(propsData.contact.displayName)).toBe(true);
  });

  it('renders a wallet address if it has the data', () => {
    expect(propsData.contact.address.length > 0).toBe(true);
    expect(wrapper.html().includes(propsData.contact.address)).toBe(true);
  });

  it('renders a custom message if there is no wallet address available', () => {
    const contactCopy = Object.assign({}, propsData.contact);
    delete contactCopy.address;
    wrapper.setProps({contact: contactCopy});
    expect(wrapper.html().includes('No wallet address is available for this contact')).toBe(true);
  });

  it('navigates to correct route when clicked on', () => {
    expect(store.state.route.path).toBe('/');
    wrapper.find('.contact-list-item').trigger('click');
    expect(store.state.route.path).toBe(`/contact-item/${propsData.contact.id}`);
  });
});
