class Email {
  constructor({
    vm,
    to,
    body,
    subject,
  }) {
    this.vm = vm;
    this.email = cordova.plugins.email;
    this.to = to;
    this.subject = subject;
    this.body = body;
  }

  /**
   * Sends an Email
   */
  async send() {
    let hasPermission = await this.vm.permissions.email.detect();
    if (!hasPermission) hasPermission = await this.vm.permissions.email.request();
    if (!hasPermission) {
      this.vm.$toast.create(420, this.vm.$t('needsEmailPermissions'), 500);
    } else {
      const hasConfiguredEmail = await this.vm.permissions.email.hasConfiguredEmail();
      if (!hasConfiguredEmail) {
        this.vm.$toast.create(420, this.vm.$t('needsEmailAccount'), 500);
      } else {
        this.email.open({
          to: this.to,
          subject: this.subject,
          body: this.body,
        });
      }
    }
  }
}

export default ({ Vue }) => {
  Vue.prototype.Email = Email;
};
