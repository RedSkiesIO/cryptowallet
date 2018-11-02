import coins from './coins.js';
import currencies from './currencies.js';

export default {
  pin: {
    minLength: 6,
  },
  acNode: {},
  coins,
  currencies,
  selectedCurrency: currencies.GBP,
};
