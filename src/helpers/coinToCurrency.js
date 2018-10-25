const exchangeRates = {
  btc: [
    {
      currency: 'USD',
      value: 6431.14,
    },
    {
      currency: 'GPB',
      value: 4977.06,
    },
  ],
  eth: [
    {
      currency: 'USD',
      value: 201.76,
    },
    {
      currency: 'GPB',
      value: 156.14,
    },
  ],
  atlas: [
    {
      currency: 'USD',
      value: 22222,
    },
    {
      currency: 'GPB',
      value: 9999,
    },
  ],
};

/**
 * Calcuates the value of a coin in a given currency
 * @param  {Number} amount
 * @param  {String} coin
 * @param  {String} currency
 * @return {Number}
 */

export default function coinToCurrency(amount, coin, currency) {
  const { value } = exchangeRates[coin].find(item => item.currency === currency);
  return amount * value;
}
