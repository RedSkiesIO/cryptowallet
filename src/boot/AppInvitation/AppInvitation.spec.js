import AppInvitation from './index.js';
import { shallowMount } from '@vue/test-utils';
import { localVue, i18n } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';
import SMS from '@/boot/Sms/mock';
import Email from '@/boot/Email/mock';

const store = createStoreMocks().store;
const wrapperMock = shallowMount({name: 'mock', template: '<div/>'}, { i18n, localVue, store });
const contact = store.state.contacts.contacts[0];
let invitation;

beforeEach(() => {
  wrapperMock.vm.SMS = SMS;
  wrapperMock.vm.Email = Email;
  invitation = new wrapperMock.vm.AppInvitation({ vm: wrapperMock.vm, contact: contact });
});

describe('plugins/AppInvitation', () => {
  it('exports a function', () => {
    expect(typeof AppInvitation === 'function').toBe(true);
  });

  it('gets the contact mobile phone number', () => {
    expect(invitation.mobilePhoneNumber() === contact.phoneNumbers[0].value).toBe(true);
  });

  it('gets the contact email address', () => {
    expect(invitation.emailAddress() === 'blockchain@yo.lo').toBe(true);
  });

  it('chooses correct actions', () => {
    const contactCopy = Object.assign({}, contact);
    invitation = new wrapperMock.vm.AppInvitation({ vm: wrapperMock.vm, contact: contactCopy });
    expect(invitation.actions().length).toBe(2);
    contactCopy.emails = null;
    expect(invitation.actions().length).toBe(1);
    contactCopy.phoneNumbers = null;
    expect(invitation.actions().length).toBe(0);
  });

  it('creates and sends an SMS when sendSMS() is called', () => {
    invitation.sendSMS();
    expect(invitation.invitation.number === contact.phoneNumbers[0].value).toBe(true);
    expect(invitation.invitation.message === 'magic test message').toBe(true);
    expect(invitation.invitation.manual === true).toBe(true);
    expect(invitation.invitation.vm === wrapperMock.vm).toBe(true);
    expect(invitation.invitation.send).toHaveBeenCalled();
  });

  it('creates and sends an Email when sendEmail() is called', () => {
    invitation.sendEmail();
    expect(invitation.invitation.to === 'blockchain@yo.lo').toBe(true);
    expect(invitation.invitation.subject === 'Email subject').toBe(true);
    expect(invitation.invitation.body === 'Email body').toBe(true);
    expect(invitation.invitation.vm === wrapperMock.vm).toBe(true);
    expect(invitation.invitation.send).toHaveBeenCalled();
  });

  it('calls vm.$q.actionSheet with correct options', () => {
    let options;
    wrapperMock.vm.$q.actionSheet = function(opt) {
      options = opt;
      return new Promise(() => {});
    };

    invitation.send();
    expect(options.title === wrapperMock.vm.$t('appInvitationVia')).toBe(true);
    expect(options.dismissLabel === wrapperMock.vm.$t('cancel')).toBe(true);
    expect(options.actions[0].label === 'SMS').toBe(true);
    expect(options.actions[1].label === 'Email').toBe(true);
  });

  it('calls sendSMS() method when SMS action is triggered', () => {
    let options;
    wrapperMock.vm.$q.actionSheet = function(opt) {
      options = opt;
      return new Promise((resolve) => {
        resolve({ label: 'SMS' });
      });
    };

    invitation.sendSMS = jest.fn();
    invitation.send();

    wrapperMock.vm.$nextTick(() => {
      expect(invitation.sendSMS).toHaveBeenCalled();
    });
  });

  it('calls sendEmail() method when Email action is triggered', () => {
    let options;
    wrapperMock.vm.$q.actionSheet = function(opt) {
      options = opt;
      return new Promise((resolve) => {
        resolve({ label: 'Email' });
      });
    };

    invitation.sendEmail = jest.fn();
    invitation.send();

    wrapperMock.vm.$nextTick(() => {
      expect(invitation.sendEmail).toHaveBeenCalled();
    });
  });
});
