import { Model } from '@vuex-orm/core';

/**
 * KeyPair Entity.
 */
export default class KeyPair extends Model {
  static entity = 'keyPair';

  /**
   * Sets entity attributes.
   * @returns {{id: increment, account_id: attr, name: attr, wallet: attr}}
   */
  static fields() {
    return {
      id: this.increment(),
      account_id: this.attr(''),
      wallet_id: this.attr(''),
      keyPair: this.attr(''),
    };
  }
}
