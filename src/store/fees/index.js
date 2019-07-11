import { Model } from '@vuex-orm/core';

export default class fees extends Model {
  static entity = 'fees';

  static primaryKey = ['code'];

  static fields() {
    return {
      code: this.attr(''),
      timestamp: this.attr(''),
      data: this.attr(''),
    };
  }
}
