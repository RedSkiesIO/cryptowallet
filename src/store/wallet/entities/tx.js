import { Model } from '@vuex-orm/core';

/**
 * Tx Entity.
 */
export default class Tx extends Model {
  static entity = 'tx';
  static fields() {
    return {
      id: this.increment(),
      account_id: this.attr(''),
      wallet_id: this.attr(''),
      hash: this.attr(''),
      blockHeight: this.attr(''),
      change: this.attr(''),
      confirmed: this.attr(''),
      confirmations: this.attr(''),
      receivedTime: this.attr(''),
      confirmedTime: this.attr(''),
      fee: this.attr(''),
      receiver: this.attr(''),
      sender: this.attr(''),
      sent: this.attr(''),
      value: this.attr(''),
      isChange: this.attr(false),
      contractCall: this.attr(false),
    };
  }
}
