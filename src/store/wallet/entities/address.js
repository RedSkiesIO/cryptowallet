import { Model } from '@vuex-orm/core';

/**
 * Address Entity.
 */
export default class Address extends Model {
  static entity = 'address';
  static fields() {
    return {
      id: this.increment(),
      wallet_id: this.attr(''),
      account_id: this.attr(''),
      address: this.attr(''),
      index: this.attr(''),
      chain: this.attr(''),
      used: this.attr(false),
    };
  }
}
