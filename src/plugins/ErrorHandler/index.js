/*eslint-disable*/
import Rollbar from 'vue-rollbar';

/**
 * Export plugin as vue prototype.
 * @param Vue
 */

export default ({ Vue }) => {
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
    console.error(err);
    console.log('ERROR UPLOADED TO ROLLBAR');
    Vue.rollbar.error(err);

    console.log('trace start');
    console.log(err);
    console.log(vm);
    console.log(info);
    console.log('trace end');
  };
};
