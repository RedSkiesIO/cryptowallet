import axios from 'axios';

/**
 * Installs the axios plugin.
 * @param Vue
 */
export default ({ Vue }) => {
  Vue.prototype.$axios = axios;
};
