import Vue from 'vue';

/**
 * Handles the contacts import and saves them in the store
 */
export default function Contacts() {
  this.vm = new Vue();
  this.import = (contacts) => {
    this.contacts = contacts;
    this.vm.$once('contactsImported', () => { return this.success(); });
    this.vm.$once('contactsImportFailure', () => { return this.failure(); });
    this.vm.$once('contactsImportError', (event) => { return this.error(event.payload); });

    try {
      const options = new ContactFindOptions();
      options.multiple = true;
      const fields = ['*'];
      navigator.contacts.find(fields, (contactsArray) => {
        this.contacts.contacts = contactsArray;
        this.vm.$emit('contactsImported');
      }, () => {
        this.vm.$emit('contactsImportFailure');
      }, options);
    } catch (err) {
      this.vm.$emit('contactsImportError', { payload: err });
    }

    return this;
  };

  this.on = (event, callback) => {
    this[event] = callback;
    return this;
  };
}
