import Vue from 'vue';
import Vuex from 'vuex';
import VuexORM from '@vuex-orm/core';
import VuexORMLoki from '@atlascity/vuex-orm-plugin-lokijs';

import wallet from '@/store/wallet';
import contacts from '@/store/contacts/__mocks__/contacts.js';
import search from '@/store/search/__mocks__/search.js';
import settings from '@/store/settings/__mocks__/settings.js';
import setup from '@/store/setup/__mocks__/setup.js';
import qrcode from '@/store/qrcode/__mocks__/qrcode.js';
import modals from '@/store/modals/__mocks__/modals.js';

// entities
import Account from '@/store/wallet/entities/account';
import Address from '@/store/wallet/entities/address';
import Tx from '@/store/wallet/entities/tx';
import Utxo from '@/store/wallet/entities/utxo';
import Wallet from '@/store/wallet/entities/wallet';
import Coin from '@/store/wallet/entities/coin';
import KeyPair from '@/store/wallet/entities/keyPair';
import Prices from '@/store/prices';
import LatestPrice from '@/store/latestPrice';

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

const options = {
  env: 'browser',
};

VuexORM.use(VuexORMLoki, { database, options });

export const actions = {};
export const getters = {};
export const mutations = {};
export const state = {};

export function createMocks(custom = {
  getters: {}, mutations: {}, actions: {}, state: {},
}) {
  /**
   * mock store modules.
   */
  const modules = {
    wallet,
    search,
    settings,
    contacts,
    setup,
    qrcode,
    modals,
  };

  let mockGettersCombined = {};
  let mockMutationsCombined = {};
  let mockActionsCombined = {};
  let mockStateCombined = {};

  Object.entries(modules).forEach(([name, module]) => {
    mockGettersCombined = Object.assign({}, mockGettersCombined, module.getters);
    mockMutationsCombined = Object.assign({}, mockMutationsCombined, module.mutations);
    mockActionsCombined = Object.assign({}, mockActionsCombined, module.actions);
    mockStateCombined = Object.assign({}, mockStateCombined, module.state);

    if (custom.state && custom.state[name]) {
      module.state = Object.assign(module.state, custom.state[name]);
    }

    modules[name] = {
      namespaced: true,
      getters: Object.assign({}, getters, module.getters),
      mutations: Object.assign({}, mutations, module.mutations),
      actions: Object.assign({}, actions, module.actions),
      state: Object.assign({}, state, module.state),
    };
  });

  mockGettersCombined = Object.assign({}, mockGettersCombined, custom.getters);
  mockMutationsCombined = Object.assign({}, mockMutationsCombined, custom.mutations);
  mockActionsCombined = Object.assign({}, mockActionsCombined, custom.actions);
  mockStateCombined = Object.assign({}, mockStateCombined, custom.state);
  return {
    getters: mockGettersCombined,
    mutations: mockMutationsCombined,
    actions: mockActionsCombined,
    state: mockStateCombined,
    store: new Vuex.Store({
      getters: mockGettersCombined,
      mutations: mockMutationsCombined,
      actions: mockActionsCombined,
      state: mockStateCombined,
      modules,
      plugins: [VuexORM.install(database)],
    }),
  };
}

export const { store } = createMocks();
