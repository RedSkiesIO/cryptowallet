const clipboard = {
  mockBehaviour: null,
  text: 'pasted text',
  paste(callback) {
    if (this.mockBehaviour === null) {
      throw new Error('please specify the clipboard mock behaviour');
    }

    if (this.mockBehaviour === 1) {
      callback(this.text);
    }

    if (this.mockBehaviour === 2) {
      throw new Error('fake error');
    }
  },
};

export default clipboard;
