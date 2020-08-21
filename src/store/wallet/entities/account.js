import { Model } from '@vuex-orm/core';
import { Dark } from 'quasar';
import Wallet from './wallet';

/**
 * Account Entity.
 */
export default class Account extends Model {
  static entity = 'account';

  static AES = ['refresh_token'];

  static fields() {
    return {
      id: this.increment(),
      uid: this.attr(''),
      refresh_token: this.attr(null),
      salt: this.attr(''),
      pinHash: this.attr(''),
      name: this.attr(''),
      email: this.attr(null),
      locale: this.attr(''),
      currency: this.attr(''),
      node: this.attr(''),
      default: this.attr(false),
      wallets: this.hasMany(Wallet, 'account_id'),
      showTestnets: this.attr(true),
      darkMode: this.boolean(false),
      demoMode: this.boolean(false),
    };
  }

  static mutators() {
    return {
      darkMode(value) {
        Dark.set(value);
        return value;
      },
    };
  }
}
