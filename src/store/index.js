import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';

import wallet from './wallet';
import account from './account';
import payments from './payments';

import cordovaStateInit from './cordovaStateInit';

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
});


const store = new Vuex.Store({
  modules: {
    wallet,
    account,
    payments,
  },
  plugins: [vuexLocal.plugin],
});

cordovaStateInit(store);

export default store;
