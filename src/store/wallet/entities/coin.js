import { Model } from '@vuex-orm/core';

/**
 * Coin Entity.
 */
export default class Coin extends Model {
  static entity = 'coin';

  static primaryKey = 'name';

  static fields() {
    return {
      name: this.attr(''),
      displayName: this.attr(''),
      minConfirmations: this.attr(''),
      sdk: this.attr(''),
      symbol: this.attr(''),
      network: this.attr(''),
      denomination: this.attr(''),
      parentName: this.attr(''),
      parentSdk: this.attr(''),
      contractAddress: this.attr(''),
      decimals: this.attr(''),
      api: this.attr(''),
      imported: this.attr(false),
      testnet: this.attr(false),
      canBuy: this.attr(false),
      show: this.attr(true),
    };
  }
}
