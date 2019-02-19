import { shallowMount, mount } from '@vue/test-utils';
import Invite from '@/components/Invite';
import SearchContacts from '@/components/Contacts/SearchContacts';
import ContactsList from '@/components/Contacts/ContactsList';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';
import cordovaMocks from '@/cordovaMocks';

describe('Invite', () => {
  let storeMocks;
  let wrapper;
  let store;

  function wrapperInit (options) {
    return shallowMount(Invite, options);
  }

  function storeInit (custom) {
    storeMocks = createStoreMocks(custom);
    wrapper = wrapperInit({ i18n, localVue, store: storeMocks.store });
    store = wrapper.vm.$store;
    cordovaMocks.initMocks();
  }

  beforeEach(() => storeInit());
  afterEach(() => cordovaMocks.destroyMocks());

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('renders its child components', () => {
    expect(wrapper.contains(SearchContacts)).toBe(true);
    expect(wrapper.contains(ContactsList)).toBe(true);
  });

  it('renders two modals', () => {
    expect(wrapper.findAll('qmodal-stub').length === 2).toBe(true);
  });

  it('calls sendAppInvitation() method when you click on the button', () => {
    const sendAppInvitationMock = jest.fn();
    wrapper = mount(Invite, { i18n, localVue, store: storeMocks.store });
    wrapper.setMethods({ sendAppInvitation: sendAppInvitationMock });
    wrapper.find('.send-invitation').trigger('click');
    expect(sendAppInvitationMock).toHaveBeenCalled();
  });

  it('calls importContacts() method if you have READ_CONTACTS permissions', () => {
    const importContactsMock = jest.fn();
    wrapper.setMethods({ importContacts: importContactsMock });
    cordova.plugins.permissions.READ_CONTACTS.mockBehaviour = 'pass';
    wrapper.vm.sendAppInvitation();
    expect(importContactsMock).toHaveBeenCalled();
  });

  it('opens the permissionsNotice modal if you don\'t have READ_CONTACTS permissions', () => {
    expect(wrapper.vm.permissionsNoticeModalOpened).toBe(false);
    cordova.plugins.permissions.READ_CONTACTS.mockBehaviour = 'fail';
    wrapper.vm.sendAppInvitation();
    expect(wrapper.vm.permissionsNoticeModalOpened).toBe(true);
  });

  it('creates a toast on contact permissions error', () => {
    const createMock = jest.fn();
    wrapper.vm.$toast.create = createMock;
    cordova.plugins.permissions.READ_CONTACTS.mockBehaviour = 'error';
    wrapper.vm.sendAppInvitation();
    expect(createMock.mock.calls[0][1] === wrapper.vm.$t('contactsImportError')).toBe(true);
  });

  it('closes the permissionsNotice modal and calls importContacts() when closePermissionsNoticeModal() is called', () => {
    const importContactsMock = jest.fn();
    wrapper.setMethods({ importContacts: importContactsMock });
    wrapper.setData({ permissionsNoticeModalOpened: true });

    wrapper.vm.closePermissionsNoticeModal();
    expect(wrapper.vm.permissionsNoticeModalOpened).toBe(false);
    expect(importContactsMock).toHaveBeenCalled();
  });

  it('opens the invitationModal on importContacts() method success', () => {
    cordova.plugins.permissions.READ_CONTACTS.mockBehaviour = 'pass';
    navigator.contacts.mockBehaviour = 'pass';
    expect(wrapper.vm.invitationModalOpened).toBe(false);

    wrapper.vm.importContacts();
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.invitationModalOpened).toBe(true);
    });
  });

  it('creates a toast on importContacts() failure', () => {
    const createMock = jest.fn();
    wrapper.vm.$toast.create = createMock;
    cordova.plugins.permissions.READ_CONTACTS.mockBehaviour = 'pass';
    navigator.contacts.mockBehaviour = 'fail';
    wrapper.vm.importContacts();
    expect(createMock.mock.calls[0][1] === wrapper.vm.$t('contactsImportFailure')).toBe(true);
  });

  it('creates a toast on importContacts() error', () => {
    const createMock = jest.fn();
    wrapper.vm.$toast.create = createMock;
    cordova.plugins.permissions.READ_CONTACTS.mockBehaviour = 'pass';
    navigator.contacts.mockBehaviour = 'error';
    wrapper.vm.importContacts();
    expect(createMock.mock.calls[0][1] === wrapper.vm.$t('contactsImportError')).toBe(true);
  });
});
