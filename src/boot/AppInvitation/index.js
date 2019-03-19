function AppInvitation({ contact, vm }) {
  this.contact = contact;
  this.vm = vm;

  /**
   * Gets the contact mobile phone number
   * @return {String}
   */
  this.mobilePhoneNumber = () => {
    if (!this.contact.phoneNumbers) { return false; }
    return this.contact.phoneNumbers.find((item) => { return item.type === 'mobile'; }).value;
  };

  /**
   * Gets the contact email address
   * @return {String}
   */
  this.emailAddress = () => {
    if (!this.contact.emails) { return false; }
    return this.contact.emails[0].value;
  };

  /**
   * Finds out what actions will be available on the contact
   * @return {Array}
   */
  this.actions = () => {
    const actions = [];

    if (this.mobilePhoneNumber()) {
      actions.push({
        label: 'SMS',
        icon: 'sms',
      });
    }

    if (this.emailAddress()) {
      actions.push({
        label: 'Email',
        icon: 'email',
      });
    }

    return actions;
  };

  /**
   * Sends an SMS
   */
  this.sendSMS = () => {
    this.invitation = new this.vm.SMS({
      number: this.mobilePhoneNumber(),
      message: 'magic test message',
      manual: true,
      vm: this.vm,
    });

    this.invitation.send();
  };

  /**
   * Sends and Email
   */
  this.sendEmail = () => {
    this.invitation = new this.vm.Email({
      to: this.emailAddress(),
      subject: 'Email subject',
      body: 'Email body',
      vm: this.vm,
    });

    this.invitation.send();
  };

  /**
   * Initiates sending the invitation
   */
  this.send = () => {
    const options = {
      title: this.vm.$t('appInvitationVia'),
      dismissLabel: this.vm.$t('cancel'),
      actions: this.actions(),
    };

    this.vm.$q.actionSheet(options)
      .then((action) => {
        if (action.label === 'SMS') { this.sendSMS(); }
        if (action.label === 'Email') { this.sendEmail(); }
      })
      .catch(() => {
      });
  };
}

export default ({ Vue }) => {
  Vue.prototype.AppInvitation = AppInvitation;
};
