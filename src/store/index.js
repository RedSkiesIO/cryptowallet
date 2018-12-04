import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import VuexORM from '@vuex-orm/core';

// import entities.
import Account from './wallet/entities/account';
import Address from './wallet/entities/address';
import Tx from './wallet/entities/tx';
import Wallet from './wallet/entities/wallet';
import Coin from './wallet/entities/coin';
import KeyPair from './wallet/entities/keyPair';

// import modules.
import payments from './payments';
import search from './search';
import settings from './settings';
import setup from './setup';
import contacts from './contacts';

import VuexORMLoki from 'vuex-orm-lokijs/lib';

Vue.use(Vuex);

// Setup ORM database.
const database = new VuexORM.Database();

database.register(Account, {});
database.register(Address, {});
database.register(Tx, {});
database.register(Wallet, {});
database.register(Coin, {});
database.register(KeyPair, {});

// Setup persistant storage.
const vuexLocal = new VuexPersistence({
  supportCircular: true,
  storage: window.localStorage,
  modules: [settings],
});

/**
 * Create CryptoWallet Vuex store obj.
 * @type {Store<any>}
 */
const store = new Vuex.Store({
  modules: {
    payments,
    search,
    settings,
    setup,
    contacts,
  },
  plugins: [vuexLocal.plugin, VuexORM.install(database)],
});

const options = {
  env: 'browser',
  autosave: true,
  autosaveInterval: 1000,
  hydrationCompletedCallback: () => {
    setTimeout(() => {
      store.dispatch('settings/setLoading', false);
    }, 1000);
  },
};

VuexORM.use(VuexORMLoki, { database, options });

export default store;
