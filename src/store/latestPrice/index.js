import { Model } from '@vuex-orm/core';


export default class latestPrice extends Model {
    static entity = 'latestPrice';

    static primaryKey = ['coin', 'currency']


    static fields() {
      return {
        coin: this.attr(''),
        currency: this.attr(''),
        updated: this.attr(''),
        data: this.attr(''),
      };
    }
}
