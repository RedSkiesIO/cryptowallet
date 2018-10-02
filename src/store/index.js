import Vue from 'vue';
import Vuex from 'vuex';

import example from './module-example';
import wallet from './module-wallet';

Vue.use(Vuex);

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      example,
      wallet,
    },
  });

  return Store;
}
