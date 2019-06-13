import { Model } from '@vuex-orm/core';

/**
 * Tx Entity.
 */
export default class Utxo extends Model {
  static entity = 'utxo';

  static fields() {
    return {
      id: this.increment(),
      account_id: this.attr(''),
      wallet_id: this.attr(''),
      pending: this.attr(false),
      address: this.attr(''),
      amount: this.attr(''),
      scriptPubKey: this.attr(''),
      txid: this.attr(''),
      value: this.attr(''),
      vout: this.attr(''),
      spentHash: this.attr(''),
    };
  }
}
