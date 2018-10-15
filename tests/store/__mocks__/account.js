const actions = {};
const getters = {};
const mutations = {};
const state = {
  payments: {
    salt: null,
    minLength: 6,
    pinHash: null,
    pinLength: null,
  },
};

const account = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
};

export default account;
