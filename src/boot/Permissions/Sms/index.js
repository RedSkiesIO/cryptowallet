export default ({ Vue }) => {
  Vue.prototype.permissions.sms = {
    /**
     * Checks if has permission to send SMS
     * @return {Promise}
     */
    detect() {
      return new Promise((resolve) => {
        this.cordovaSms.hasPermission((hasPermission) => {
          return resolve(hasPermission);
        }, (err) => {
          throw err;
        });
      });
    },

    /**
     * Requests SMS permissions
     * @param  {Boolean} hasPermission
     * @return {Promise}
     */
    request() {
      return new Promise((resolve) => {
        this.cordovaSms.requestPermission(() => {
          resolve(true);
        }, () => {
          resolve(false);
        });
      });
    },
  };

  document.addEventListener('deviceready', () => {
    Vue.prototype.permissions.sms.cordovaSms = sms;
  }, false);
};
