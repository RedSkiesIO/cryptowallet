function Email({
  vm,
  to,
  subject,
  body,
}) {
  this.vm = vm;
  this.to = to;
  this.subject = subject;
  this.body = body;
  this.send = jest.fn();
}

export default Email;
