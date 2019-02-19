import { date as dateUtil } from 'quasar';

/**
 * Returns a translated date/month.
 * @param  {Number} timestamp
 * @param  {String} format
 * @param  {Object} vm Vue component instance
 * @return {String}
 */
export default function dateTranslater(timestamp, format, vm) {
  return dateUtil.formatDate(timestamp, format, {
    dayNames: [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ].map((item) => { return vm.$t(item); }),
    monthNames: [
      'january',
      'february',
      'march',
      'april',
      'may',
      'june',
      'july',
      'august',
      'september',
      'october',
      'november',
      'december',
    ].map((item) => { return vm.$t(item); }),
  });
}
