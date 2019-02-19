import { Model } from '@vuex-orm/core';


export default class Prices extends Model {
    static entity = 'prices';

    static primaryKey = ['coin', 'currency', 'period']


    static fields() {
      return {
        coin: this.attr(''),
        currency: this.attr(''),
        period: this.attr(''),
        updated: this.attr(''),
        data: this.attr(''),
      };
    }
}
