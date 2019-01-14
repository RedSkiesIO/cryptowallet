import coins from './coins.js';
import currencies from './currencies.js';
import supportedCoins from '../state/supportedCoins.js';

export default {
  pin: {
    minLength: 6,
  },
  acNode: {},
  coins,
  currencies,
  supportedCoins,
  selectedCurrency: currencies.GBP,
  loading: true,
  selectedAccount: null,
  layout: 'dark',
};
