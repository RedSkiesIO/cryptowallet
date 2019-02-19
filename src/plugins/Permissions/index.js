import sms from './Sms';
import email from './Email';

export default ({ Vue }) => {
  Vue.prototype.permissions = {};
  sms({ Vue });
  email({ Vue });
};
