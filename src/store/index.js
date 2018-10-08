import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';

import wallet from './wallet';
import account from './account';
import payments from './payments';

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
});

export default new Vuex.Store({
  modules: {
    wallet,
    account,
    payments,
  },
  plugins: [vuexLocal.plugin],
});
