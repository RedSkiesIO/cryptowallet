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
  constructor(value) {
    this.value = value;
  }

  set coin(val) {
    this._coin = val;
  }

  set currency(val) {
    this._currency = val;
  }

  set format(format) {
    this._format = format;
  }

  set withCurrencySymbol(val) {
    this._withCurrencySymbol = val;
  }

  set prependPlusOrMinus(val) {
    this._prependPlusOrMinus = val;
  }

  get formatted() {
    let { value } = this;
    if (this._coin && this._currency) {
      value = this.coinToCurrency(this.value, this._coin, this._currency);
    }

    let formatted = `${numeral(Math.abs(value)).format(this._format)}`;
    if (this._currency) formatted = `${currencySymbols[this._currency]}${formatted}`;

    if (this._prependPlusOrMinus) {
      if (value < 0) return `&#45; ${formatted}`;
      if (value > 0) return `&#43; ${formatted}`;
    }

    return formatted;
  }

  coinToCurrency() {
    const { rate } = exchangeRates[this._coin].find(item => item.currency === this._currency);
    return this.value * rate;
  }
}
