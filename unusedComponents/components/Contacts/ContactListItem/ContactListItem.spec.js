import { shallowMount } from '@vue/test-utils';
import ContactListItem from '@/components/Contacts/ContactListItem';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';
import AppInvitationMock from '@/boot/AppInvitation/mock/';

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
    wrapper.setProps({ contact: contactCopy });
    expect(wrapper.html().includes('No wallet address is available for this contact')).toBe(true);
  });

  it('it calls clickHandler() method when clicked on', () => {
    const clickHandlerMock = jest.fn();
    wrapper.setMethods({ clickHandler: clickHandlerMock });
    wrapper.find('.contact-list-item').trigger('click');
    expect(clickHandlerMock).toHaveBeenCalled();
  });

  it('creates an AppInvitation when clickItemAction prop === \'app-invitation\'', () => {
    wrapper.setProps({ clickItemAction: 'app-invitation' });
    wrapper.vm.AppInvitation = AppInvitationMock;
    wrapper.vm.clickHandler();;
    expect(wrapper.vm.invitation.send).toHaveBeenCalled();
  });

  it('returns false from clickHandler() method', () => {
    expect(wrapper.vm.clickHandler()).toBe(false);
  });
});
