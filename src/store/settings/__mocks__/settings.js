import coins from '../state/coins.js';
import currencies from '../state/currencies.js';
import supportedCoins from '../state/supportedCoins.js';

const actions = {};
const getters = {};
const mutations = {};

const state = {
  pin: {
    minLength: 6,
  },
  delay: 500,
  coins,
  currencies,
  supportedCoins,
};

const account = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
};

export default account;
