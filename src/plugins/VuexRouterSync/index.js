import { sync } from 'vuex-router-sync';

/**
 * Export plugin as vue prototype.
 * @param store
 * @param router
 */
export default ({ store, router }) => {
  sync(store, router);
};
