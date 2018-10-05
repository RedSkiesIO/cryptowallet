import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';

import wallet from './wallet';
import payments from './payments';

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
});

export default new Vuex.Store({
  modules: {
    wallet,
    payments,
  },
  plugins: [vuexLocal.plugin],
});
