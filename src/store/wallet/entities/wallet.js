import { Model } from '@vuex-orm/core';
import Account from './account';
import Coin from './coin';

/**
 * Wallet Entity.
 */
export default class Wallet extends Model {
  static entity = 'wallet';

  /**
   * Sets entity attributes.
   * @returns {{id: Attr, coin_id: BelongsTo, account_id: BelongsTo}}
   */
  static fields() {
    return {
      id: this.attr(null),
      coin_id: this.belongsTo(Coin, 'coin_id'),
      account_id: this.belongsTo(Account, 'wallet_id'),
    };
  }
}
