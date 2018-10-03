import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

/**
 * Currenty we have only one store module called "wallet", it is very simple...
 * I have quickly mocked it up below, but eventually we should move it to it's own file
 */

export const actions = {};
export const getters = {};
export const mutations = {};
export const state = {
  payments: [
    {
      ts: 1539527543000,
      title: 'Sainsbury\'s',
      amount: -4.97,
    },
    {
      ts: 1539527543000,
      title: 'Amazon',
      amount: -10.00,
    },
    {
      ts: 1539144743000,
      title: 'Motion',
      amount: -47.97,
    },
    {
      ts: 1539181943000,
      title: 'Space',
      amount: -27.98,
    },
    {
      ts: 1539866783000,
      title: 'From Tom Jones',
      amount: 8.10,
    },
  ],
};

const wallet = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};

// eslint-disable-next-line no-underscore-dangle
export function __createMocks(custom = {
  getters: {},
  mutations: {},
  actions: {},
  state: {},
}) {
  /**
   * The store mock is being setup here,
   * its going to contain all of the elemnts from all of the store modules.
   */

  const modules = {
    wallet,
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
      getters: Object.assign({}, getters, module.getters),
      mutations: Object.assign({}, mutations, module.mutations),
      actions: Object.assign({}, actions, module.actions),
      state: Object.assign({}, state, module.state),
    };
  });

  mockGettersCombined = Object.assign({}, getters, custom.getters);
  mockMutationsCombined = Object.assign({}, mutations, custom.mutations);
  mockActionsCombined = Object.assign({}, actions, custom.actions);
  mockStateCombined = Object.assign({}, state, custom.state);

  return {
    getters: mockGettersCombined,
    mutations: mockMutationsCombined,
    actions: mockActionsCombined,
    state: mockStateCombined,
    store: new Vuex.Store({ modules }),
  };
}

const { store } = __createMocks().store;

export default store;
