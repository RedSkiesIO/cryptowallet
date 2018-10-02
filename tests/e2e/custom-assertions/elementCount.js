exports.assertion = (selectors, count) => {
  this.message = `Testing if element ${selectors} has count: ${count}`;
  this.expected = count;

  this.pass = val => val === this.expected;

  this.value = res => res.value;

  this.command = (cb) => {
    const self = this;
    return this.api.execute(
      selector => document.querySelectorAll(selector).length,
      [selectors],
      (res) => {
        cb.call(self, res);
      },
    );
  };
};

