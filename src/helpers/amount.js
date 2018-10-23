import numeral from 'numeral';

/**
 * Returns formatted amount as String
 * @param  {Number} value
 * @param  {String} currency
 * @return {String}
 */
export default function amount(value, currency) {
  let formatted = `${numeral(Math.abs(value)).format('0.00')}`;
  if (currency) formatted = `${currency}${formatted}`;
  if (value < 0) return `&#8722; ${formatted}`;
  return `&#43; ${formatted}`;
}
