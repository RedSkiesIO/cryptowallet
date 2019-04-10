const contacts = {
  mockedContactsArray: undefined,
  mockBehaviour: undefined,
  find(options, success, fail) {
    if (!this.mockBehaviour) throw new Error('mock behaviour not specified');
    if (this.mockBehaviour === 'pass') success(this.mockedContactsArray);
    if (this.mockBehaviour === 'fail') fail();
    if (this.mockBehaviour === 'error') throw new Error('mocked error');
  },
};

export default contacts;
