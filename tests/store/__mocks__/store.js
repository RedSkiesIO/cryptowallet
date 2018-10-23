import Vue from 'vue';
import Vuex from 'vuex';

import wallet from './wallet.js';
import payments from './payments.js';
import account from './account.js';
import search from './search.js';

Vue.use(Vuex);

export const actions = {};
export const getters = {};
export const mutations = {};
export const state = {};

export function __createMocks(custom = { getters: {}, mutations: {}, actions: {}, state: {} }) {
  /**
   * mock store modules.
   */
  const modules = {
    wallet,
    payments,
    account,
    search,
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
    store: new Vuex.Store({ modules }),
  };
}

export const store = __createMocks().store;
