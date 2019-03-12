import { Model } from '@vuex-orm/core';
import Wallet from './wallet';

/**
 * Account Entity.
 */
export default class Account extends Model {
  static entity = 'account';

  static AES = ['seed', 'refresh_token'];

  static fields() {
    return {
      id: this.increment(),
      uid: this.attr(''),
      refresh_token: this.attr(null),
      salt: this.attr(''),
      pinHash: this.attr(''),
      name: this.attr(''),
      locale: this.attr(''),
      currency: this.attr(''),
      node: this.attr(''),
      default: this.attr(false),
      seed: this.attr(''),
      wallets: this.hasMany(Wallet, 'account_id'),
    };
  }
}
