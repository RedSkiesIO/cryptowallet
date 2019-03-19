function SMS({
  vm,
  number,
  message,
  manual = '',
}) {
  this.vm = vm;
  this.number = number;
  this.message = message;
  this.manual = manual;
  this.send = jest.fn();
}

export default SMS;
