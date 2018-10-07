import bcrypt from 'bcryptjs';

const ACMWCrypto = {

  /**
   * Returns a bcrypt hashed string, with pre-defined salt.
   * @param {*} string
   * @param {*} salt
   */
  bcryptHashString(string, salt) {
    console.log('trace bcryptHashString');
    return bcrypt.hashSync(string, salt);
  },

  /**
   * compares a unhashed string with a bcrypt string
   * @param {*} string
   * @param {*} hashedString
   */
  bcryptCompareString(string, hashedString) {
    console.log('trace bcryptCompareString');
    console.log(string);
    console.log(hashedString);
    return bcrypt.compareSync(string, hashedString);
  },

};

export default ({ Vue }) => {
  Vue.prototype.$acmwcrypto = ACMWCrypto;
};