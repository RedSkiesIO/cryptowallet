import { Model } from '@vuex-orm/core';

/**
 * Account Entity.
 */
export default class Account extends Model {
  static entity = 'account';

  /**
   * Sets entity attributes.
   * @returns {{id: Increment, uid: Attr, salt: Attr, pinHash: Attr}}
   */
  static fields() {
    return {
      id: this.increment(),
      uid: this.attr(''),
      salt: this.attr(''),
      pinHash: this.attr(''),
    };
  }
}
