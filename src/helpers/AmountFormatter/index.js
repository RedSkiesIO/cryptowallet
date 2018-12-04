/**
 * @TODO James Konrad
 * I've mocked some exchange rates below for the amount() function to use
 * Would make sense to put them somewhere in the Vuex store
 */

import numeral from 'numeral';

const exchangeRates = {
  BTC: [
    {
      currency: 'USD',
      rate: 6431.14,
    },
    {
      currency: 'GBP',
      rate: 4977.06,
    },
  ],
  ETH: [
    {
      currency: 'USD',
      rate: 201.76,
    },
    {
      currency: 'GBP',
      rate: 156.14,
    },
  ],
  ATL: [
    {
      currency: 'USD',
      rate: 22222,
    },
    {
      currency: 'GBP',
      rate: 9999,
    },
  ],
};

export default class AmountFormatter {
  constructor(options) {
    this.amount = options.amount;
    this.coin = options.coin;
    this.currency = options.currency;
    this.format = options.format;
    this.withCurrencySymbol = options.withCurrencySymbol;
    this.prependPlusOrMinus = options.prependPlusOrMinus;
  }

  /**
   * Formats a Number and returns a String
   * @return {String}
   */
  getFormatted() {
    let { amount } = this;
    if (this.coin && this.currency) {
      amount = this.coinToCurrency(this.amount, this.coin, this.currency);
    }

    let formatted = `${numeral(Math.abs(amount)).format(this.format)}`;
    if (this.currency) formatted = `${this.currency.symbol}${formatted}`;

    if (this.prependPlusOrMinus) {
      if (amount < 0) return `- ${formatted}`;
      if (amount > 0) return `+ ${formatted}`;
    }

    return formatted;
  }

  /**
   * Converts a coin into a currency
   * @return {Number}
   */
  coinToCurrency() {
    const { rate } = exchangeRates[this.coin].find(item => item.currency === this.currency.code);
    if (rate) return this.amount * rate;
    return this.amount;
  }
}
