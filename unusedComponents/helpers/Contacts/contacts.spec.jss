import ContactsImport from './index.js';
import { localVue, i18n } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';
import cordovaMocks from '@/cordovaMocks';

const store = createStoreMocks().store;
let contactsIntance;

describe('helpers/Contacts', () => {

  beforeEach(() => {
    cordovaMocks.initMocks();
    contactsIntance = new ContactsImport();
  });

  afterEach(() => cordovaMocks.destroyMocks());

  it('exports a function', () => {
    expect(typeof ContactsImport).toBe('function');
  });

  it('updates the store and calls success() callback on successful import', (done) => {
    const mockedContactsArray = ['mocked contact item'];
    navigator.contacts.mockBehaviour = 'pass';
    navigator.contacts.mockedContactsArray = mockedContactsArray;

    contactsIntance.on('success', () => {
      expect(store.state.contacts.contacts).toBe(mockedContactsArray);
      done();
    }).import(store.state.contacts);
  });


  it('calls failure() callback on failed import', (done) => {
    navigator.contacts.mockBehaviour = 'fail';
    contactsIntance.on('failure', () => {
      done();
    }).import(store.state.contacts);
  });

  it('calls error() callback on error', (done) => {
    navigator.contacts.mockBehaviour = 'error';
    contactsIntance.on('error', (err) => {
      expect(err.message).toBe('mocked error');
      done();
    }).import(store.state.contacts);
  });
});
