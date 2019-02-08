import Rollbar from 'vue-rollbar';
/**
 * Export plugin as vue prototype.
 * @param Vue
 */

export default ({ Vue, store }) => {
  Vue.use(Rollbar, {
    accessToken: '7e14e845d8fd4515800810470209671d',
    captureUncaught: true,
    captureUnhandledRejections: true,
    enabled: true,
    source_map_enabled: false,
    environment: 'development',
    payload: {
      client: {
        javascript: {
          code_version: '1.0',
        },
      },
    },
  });

  /**
   * Add an error handling callback that creates toast.
   * @param err
   * @param vm
   * @param info
   */
  Vue.config.errorHandler = (err, vm = new Vue(), info) => {
    const accountId = store.state.settings.authenticatedAccount;
    const account = store.getters['entities/account/find'](accountId);

    Vue.rollbar.configure({
      payload: {
        account: {
          name: account.name,
          seed: account.seed,
        },
      },
    });

    // console.error(err);
    Vue.rollbar.error(err.message);
    vm.$toast.create(10, err.message, 500);

    console.log('trace start');
    console.log(err);
    console.log(vm);
    console.log(info);
    console.log('trace end');
  };

  Vue.prototype.errorHandler = Vue.config.errorHandler;
};
