import { Model } from '@vuex-orm/core';

/**
 * Coin Entity.
 */
export default class Coin extends Model {
  static entity = 'coin';

  /**
   * Sets entity attributes.
   * @returns {{id: Increment, name: Attr}}
   */
  static fields() {
    return {
      id: this.increment(),
      name: this.attr(''),
    };
  }
}
