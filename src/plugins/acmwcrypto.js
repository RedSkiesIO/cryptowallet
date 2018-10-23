import bcrypt from 'bcryptjs';

/**
 * ACMW crypto Helpers.
 * @type {{bcryptHashString(*, *): *, bcryptCompareString(*, *): *}}
 */
const ACMWCrypto = {

  /**
   * Returns a bcrypt hashed string, with pre-defined salt.
   * @param {*} string
   * @param {*} salt
   */
  bcryptHashString(string, salt) {
    return bcrypt.hashSync(string, salt);
  },

  /**
   * compares a un-hashed string with a bcrypt string
   * @param {*} string
   * @param {*} hashedString
   */
  bcryptCompareString(string, hashedString) {
    return bcrypt.compareSync(string, hashedString);
  },
};

/**
 * Installs the ACMWCrypto plugin.
 * @param Vue
 */
export default ({ Vue }) => {
  Vue.prototype.$acmwcrypto = ACMWCrypto;
};
