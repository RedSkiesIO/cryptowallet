import coins from '../state/coins.js';
import currencies from '../state/currencies.js';
import supportedCoins from '../state/supportedCoins.js';
import supportedCurrencies from '../state/supportedCurrencies.js';

const actions = {
  setLoading: jest.fn(),
  setSelectedAccount: jest.fn(),
  setAuthenticatedAccount: jest.fn(),
  setLayout: jest.fn(),
  setCurrency: jest.fn(),
};
const getters = {};
const mutations = {};

const state = {
  authenticatedAccount: 1,
  pin: {
    minLength: 6,
  },
  delay: {
    normal: 500,
    vlong: 1000,
  },
  acNode: {},
  coins,
  currencies,
  supportedCoins,
  supportedCurrencies,
  selectedCurrency: {
    code: 'GBP',
    exponent: 2,
    name: 'British Pound Sterling',
    name_plural: 'British pounds sterling',
    rounding: 0,
    symbol: '£',
    symbol_native: '£',
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
