/**
 * @TODO James Konrad
 * I've mocked some exchange rates below for the amount() function to use
 * Would make sense to put them somewhere in the Vuex store
 */

import numeral from 'numeral';

const currencySymbols = {
  USD: '$',
  GPB: '£',
};

const exchangeRates = {
  BTC: [
    {
      currency: 'USD',
      rate: 6431.14,
    },
    {
      currency: 'GPB',
      rate: 4977.06,
    },
  ],
  ETH: [
    {
      currency: 'USD',
      rate: 201.76,
    },
    {
      currency: 'GPB',
      rate: 156.14,
    },
  ],
  ATL: [
    {
      currency: 'USD',
      rate: 22222,
    },
    {
      currency: 'GPB',
      rate: 9999,
    },
  ],
};


export default class Amount {
  constructor(options) {
    this.amount = options.amount;
    this.coin = options.coin;
    this.currency = options.currency;
    this.format = options.format;
    this.withCurrencySymbol = options.withCurrencySymbol;
    this.prependPlusOrMinus = options.prependPlusOrMinus;
  }

  get formatted() {
    let { amount } = this;
    if (this.coin && this.currency) {
      amount = this.coinToCurrency(this.amount, this.coin, this.currency);
    }

    let formatted = `${numeral(Math.abs(amount)).format(this.format)}`;
    if (this.currency) formatted = `${currencySymbols[this.currency]}${formatted}`;

    if (this.prependPlusOrMinus) {
      if (amount < 0) return `&#45; ${formatted}`;
      if (amount > 0) return `&#43; ${formatted}`;
    }

    return formatted;
  }

  coinToCurrency() {
    const { rate } = exchangeRates[this.coin].find(item => item.currency === this.currency);
    return this.amount * rate;
  }
}
