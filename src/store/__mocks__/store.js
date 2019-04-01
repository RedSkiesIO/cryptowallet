import Vue from 'vue';
import Vuex from 'vuex';
import wallet from '@/store/wallet';
import contacts from '@/store/contacts/__mocks__/contacts.js';
import search from '@/store/search/__mocks__/search.js';
import settings from '@/store/settings/__mocks__/settings.js';
import setup from '@/store/setup/__mocks__/setup.js';

Vue.use(Vuex);

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

export const { store } = createMocks();
