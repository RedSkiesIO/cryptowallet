class SMS {
  constructor({
    vm,
    number,
    message,
    manual = '',
  }) {
    this.sms = sms;
    this.vm = vm;
    this.number = number;
    this.message = message;
    this.options = {
      replaceLineBreaks: false,
      android: {
        intent: manual,
      },
    };

    if (manual) { this.options.android.intent = 'INTENT'; }
  }

  /**
   * If has permission, sends an SMS
   */
  async send() {
    let hasPermission = await this.vm.permissions.sms.detect();
    if (!hasPermission) { hasPermission = await this.vm.permissions.sms.request(); }
    if (!hasPermission) {
      this.vm.$toast.create(420, this.vm.$t('needsSmsPermissions'), 500);
    } else {
      try {
        this.sms.send(this.number, this.message, this.options, () => {}, (err) => {
          throw err;
        });
      } catch (err) {
        this.vm.$toast.create(10, `ERROR ${err.message}`, 500);
      }
    }
  }
}

export default ({ Vue }) => {
  Vue.prototype.SMS = SMS;
};
