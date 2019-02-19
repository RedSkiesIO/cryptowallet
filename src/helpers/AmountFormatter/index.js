import numeral from 'numeral';

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

    if (this.removeTrailingZeros) {
      formatted = parseFloat(formatted).toString();
    }

    if (this.currency && this.withCurrencySymbol) {
      formatted = `${this.currency.symbol}${formatted}`;
    }

    if (this.prependPlusOrMinus) {
      if (amount < 0) {
        return `- ${formatted}`;
      }
      if (amount > 0) {
        return `+ ${formatted}`;
      }
    }

    return formatted;
  }

  /**
   * Converts a coin into currency
   * @return {Number}
   */
  coinToCurrency() {
    if (this.rate) {
      return this.amount * Number(this.rate.replace(/[^0-9.-]+/g, ''));
    }
    return this.amount;
  }

  /**
   * Converts currency into coin
   * @return {[type]} [description]
   */
  currencyToCoin() {
    if (this.rate) {
      return this.amount / Number(this.rate.replace(/[^0-9.-]+/g, ''));
    }
    return this.amount;
  }
}
