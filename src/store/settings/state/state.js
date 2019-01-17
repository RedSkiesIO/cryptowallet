import coins from './coins.js';
import currencies from './currencies.js';
import supportedCoins from '../state/supportedCoins.js';
import supportedCurrencies from '../state/supportedCurrencies.js';

export default {
  pin: {
    minLength: 6,
  },
  acNode: {},
  coins,
  currencies,
  supportedCoins,
  supportedCurrencies,
  selectedCurrency: currencies.GBP,
  loading: true,
  selectedAccount: null,
  layout: 'dark',
};
