/**
 * Export plugin as vue prototype.
 * @param Vue
 */
export default ({ Vue }) => {
  /**
   * Add an error handling callback that creates toast.
   * @param err
   * @param vm
   * @param info
   */
  Vue.config.errorHandler = (err, vm = new Vue(), info) => {
    console.log('trace start');
    console.log(err);
    console.log(vm);
    console.log(info);
    console.log('trace end');
    // console.log('im a techno teapot');
    // console.log(err);
    // console.log(vm.$on);
    // console.log(`info ${info}`);

    /**
     * @BUG
     * @todo find a solution to the problem:
     *
     * I wanted to make this error handler display all
     * caught errors with: vm.$toast.create(10, err.message, 500);
     * but this will cause an infinite loop in some scenarios
     *
     * The pop() method on the Toaster class calls Notify.create()
     * I think Notify.create() can trigger rerendering of a component
     * if the component has an error, rerendering will cause
     * the error to happen again, resulting in an infinite loop
     *
     * error => Notify.create() => rerendering => error
     */
  };
};
