export default ({ Vue }) => {
  Vue.prototype.permissions.email = {
    /**
     * Checks if has permission to send Email
     * @return {Promise}
     */
    detect() {
      return new Promise((resolve) => {
        this.cordovaEmail.hasPermission((hasPermission) => { return resolve(hasPermission); });
      });
    },

    /**
     * Check if user has configured email
     * @return {Promise}
     */
    hasConfiguredEmail() {
      return new Promise((resolve) => {
        this.cordovaEmail.isAvailable((hasAccount) => { return resolve(hasAccount); });
      });
    },

    /**
     * Requests SMS permissions
     * @return {Promise}
     */
    request() {
      return new Promise((resolve) => {
        this.cordovaEmail.requestPermission((granted) => { return resolve(granted); });
      });
    },
  };

  document.addEventListener('deviceready', () => {
    Vue.prototype.permissions.email.cordovaEmail = cordova.plugins.email;
  }, false);
};
