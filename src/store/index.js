import Vue from 'vue';
import Vuex from 'vuex';

import example from './module-example';
import payments from './module-payments';

Vue.use(Vuex);

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      example,
      payments,
    },
  });

  return Store;
}
