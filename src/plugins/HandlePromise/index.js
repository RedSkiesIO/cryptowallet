function to(promise) {
  return promise.then(data => [null, data])
    .catch((err) => {
      console.log(err.message);
      // this.$toast.create(10, err.message, 500);
      return [err];
    });
}

export default ({ Vue }) => {
  Vue.prototype.to = to;
};
