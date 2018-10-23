import { sync } from 'vuex-router-sync';

/**
 * This plugins job is to call sync() with store and router
 * check vuex-router-sync for more details
 * @param store
 * @param router
 */
export default ({ store, router }) => {
  sync(store, router);
  /**
   * return from this function is not needed for this plugin to work
   * but in the unit tests, the sync function is being mocked
   * to inspect it afterwards, return is needed
   */
  return sync;
};
