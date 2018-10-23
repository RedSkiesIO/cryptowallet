/*
 * this function will consume the complete Vuex store object and
 * add event listeners to Cordova's deviceready
 */
export default function (store, Vue) {
  /*
   * getDeviceContacts will attempt to get all of the devices contacts
   * as well as all of the fields available on each contact
   * if it succedes its going to mutate the Vuex store
   * @TODO Uniform error message
   */
  function getDeviceContacts() {
    try {
      const options = new ContactFindOptions();
      options.multiple = true;
      const fields = ['*'];
      navigator.contacts.find(fields, (contacts) => {
        store.state.wallet.contacts = contacts;
      }, new Error('Failed to retrieve contacts from the device'), options);
    } catch (err) {
      Vue.config.errorHandler(err);
    }
  }

  document.addEventListener('deviceready', () => {
    getDeviceContacts();
  }, false);
}
