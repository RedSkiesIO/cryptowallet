import { Model } from '@vuex-orm/core';
import Address from './address';

/**
 * Tx Entity.
 */
export default class Tx extends Model {
  static entity = 'tx';

  /**
   * Sets entity attributes.
   * @returns {{id: Increment, hash: Attr, address_id: BelongsTo}}
   */
  static fields() {
    return {
      id: this.increment(),
      hash: this.attr(''),
      address_id: this.belongsTo(Address, 'tx_id'),
    };
  }
}
