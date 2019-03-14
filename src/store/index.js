import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import VuexORM from '@vuex-orm/core';
import VuexORMLoki from '@atlascity/vuex-orm-plugin-lokijs';

// import entities.
import Account from './wallet/entities/account';
import Address from './wallet/entities/address';
import Tx from './wallet/entities/tx';
import Utxo from './wallet/entities/utxo';
import Wallet from './wallet/entities/wallet';
import Coin from './wallet/entities/coin';
import KeyPair from './wallet/entities/keyPair';
import Prices from './prices';
import LatestPrice from './latestPrice';

// import modules.
import search from './search';
import settings from './settings';
import setup from './setup';
import contacts from './contacts';

Vue.use(Vuex);

// Setup ORM database.
const database = new VuexORM.Database();

database.register(Account, {});
database.register(Address, {});
database.register(Tx, {});
database.register(Utxo, {});
database.register(Wallet, {});
database.register(Coin, {});
database.register(KeyPair, {});
database.register(Prices, {});
database.register(LatestPrice, {});

Vue.prototype.encryptedModels = [
  Account,
  Wallet,
];

window.Tx = Tx;
window.Utxo = Utxo;
window.Address = Address;
window.Wallet = Wallet;
window.LatestPrice = LatestPrice;
window.Prices = Prices;
window.Account = Account;
window.Coin = Coin;

// Setup persistant storage.
// @TODO WHY IS THIS DEFINED AND NOT USED???
/* eslint-disable-next-line */
const vuexLocal = new VuexPersistence({
  supportCircular: true,
  storage: window.localStorage,
  modules: [settings],
});


const options = {
  env: 'browser',
};

// @TODO WHY IS THIS DEFINED BEFORE USE???
function hydrationCompletedCallback() {
  setTimeout(() => {
    /* eslint-disable-next-line */
    store.dispatch('settings/setLoading', false);
  }, 1000);
}

VuexORM.use(VuexORMLoki, { database, options, hydrationCompletedCallback });

/**
 * Create CryptoWallet Vuex store obj.
 * @type {Store<any>}
 */
const store = new Vuex.Store({
  modules: {
    search,
    settings,
    setup,
    contacts,
  },
  plugins: [VuexORM.install(database)],
});

Vue.prototype.activeWallets = {};

export default store;
