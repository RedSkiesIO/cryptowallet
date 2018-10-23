import { Model } from '@vuex-orm/core';
import Wallet from './wallet';

/**
 * Address Entity.
 */
export default class Address extends Model {
  static entity = 'address';

  /**
   * Sets entity attributes.
   * @returns {{id: Increment, address: Attr, wallet_id: BelongsTo}}
   */
  static fields() {
    return {
      id: this.increment(),
      address: this.attr(''),
      wallet_id: this.belongsTo(Wallet, 'address_id'),
    };
  }
}
