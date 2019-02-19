import coins from '../state/coins.js';
import currencies from '../state/currencies.js';
import supportedCoins from '../state/supportedCoins.js';

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
  supportedCoins,
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
