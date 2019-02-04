/**
 * @TODO James Konrad
 * I've mocked some exchange rates below for the amount() function to use
 * Would make sense to put them somewhere in the Vuex store
 */

import numeral from 'numeral';

// const exchangeRates = {
//   Bitcoin: [
//     {
//       currency: 'USD',
//       rate: 6431.14,
//     },
//     {
//       currency: 'GBP',
//       rate: 3000.00,
//     },
//   ],
//   Litecoin: [
//     {
//       currency: 'USD',
//       rate: 32.68,
//     },
//     {
//       currency: 'GBP',
//       rate: 25.95,
//     },
//   ],
//   Dash: [
//     {
//       currency: 'USD',
//       rate: 81.40,
//     },
//     {
//       currency: 'GBP',
//       rate: 64.77,
//     },
//   ],
//   Ethereum: [
//     {
//       currency: 'USD',
//       rate: 201.76,
//     },
//     {
//       currency: 'GBP',
//       rate: 156.14,
//     },
//   ],
//   AtlasCity: [
//     {
//       currency: 'USD',
//       rate: 22222,
//     },
//     {
//       currency: 'GBP',
//       rate: 9999,
//     },
//   ],
//   oxProtocol: [
//     {
//       currency: 'USD',
//       rate: 0.3,
//     },
//     {
//       currency: 'GBP',
//       rate: 0.23,
//     },
//   ],
// };

export default class AmountFormatter {
  constructor(options) {
    this.rate = options.rate;
    this.amount = options.amount;
    this.coin = options.coin;
    this.toCoin = options.toCoin;
    this.toCurrency = options.toCurrency;
    this.currency = options.currency;
    this.format = options.format;
    this.withCurrencySymbol = options.withCurrencySymbol;
    this.prependPlusOrMinus = options.prependPlusOrMinus;
    this.removeTrailingZeros = options.removeTrailingZeros;
  }

  /**
   * Formats a Number and returns a String
   * @return {String}
   */
  getFormatted() {
    let { amount } = this;

    if (this.coin && this.currency && this.toCurrency) {
      amount = this.coinToCurrency(this.amount, this.rate, this.coin, this.currency);
    }

    if (this.coin && this.currency && this.toCoin) {
      amount = this.currencyToCoin(this.amount, this.rate, this.coin, this.currency);
    }

    let formatted = `${numeral(Math.abs(amount)).format(this.format)}`;
    if (this.removeTrailingZeros) formatted = parseFloat(formatted).toString();

    if (this.currency && this.withCurrencySymbol) {
      formatted = `${this.currency.symbol}${formatted}`;
    }

    if (this.prependPlusOrMinus) {
      if (amount < 0) return `- ${formatted}`;
      if (amount > 0) return `+ ${formatted}`;
    }

    return formatted;
  }

  /**
   * Converts a coin into currency
   * @return {Number}
   */
  coinToCurrency() {
    // const { rate } = exchangeRates[this.coin].find(item => item.currency === this.currency.code);
    if (this.rate) return this.amount * Number(this.rate.replace(/[^0-9.-]+/g, ''));
    console.log('rate:', this.rate);
    return this.amount;
  }

  /**
   * Converts currency into coin
   * @return {[type]} [description]
   */
  currencyToCoin() {
    // const { rate } = exchangeRates[this.coin].find(item => item.currency === this.currency.code);
    if (this.rate) return this.amount / Number(this.rate.replace(/[^0-9.-]+/g, ''));
    return this.amount;
  }
}
