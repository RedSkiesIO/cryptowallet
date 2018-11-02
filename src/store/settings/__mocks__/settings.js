import coins from '../state/coins.js';
import currencies from '../state/currencies.js';

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
  pin: {
    minLength: 6,
  },
  acNode: {},
  coins,
  currencies,
  selectedCurrency: currencies.GBP,
};

const account = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
};

export default account;
