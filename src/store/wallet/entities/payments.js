import { Model } from '@vuex-orm/core';

/**
 * KeyPair Entity.
 */
export default class Payments extends Model {
  static entity = 'payment';

  static fields() {
    return {
      id: this.attr(''),
      account_id: this.attr(''),
      wallet_id: this.attr(''),
      address: this.attr(''),
      event: this.attr(''),
      status: this.attr(''),
      isBuyOrSell: this.attr(''),
      currency: this.attr(''),
      fiatAmount: this.attr(''),
      cryptoAmount: this.attr(''),
      conversionPrice: this.attr(''),
      totalFeeInCrypto: this.attr(''),
      totalfeeInFiat: this.attr(''),
      paymentOption: this.attr(''),
      fromAddress: this.attr(''),
      expires: this.attr(''),
    };
  }
}
