const QRScanner = {
  mockBehaviour: null,
  scan: function (callback) {
    setTimeout(() => {
      if (this.mockBehaviour === null) {
        throw new Error('please specify the QRScanner mock behaviour');
      }

      if (this.mockBehaviour === 0) {
        callback(new Error('fake error'), null);
      }

      if (this.mockBehaviour === 1) {
        callback(null, 'invalid address');
      }

      if (this.mockBehaviour === 2) {
        callback(null, '2NCQfWAPZ2bCWNhsVWvu9retMFBnfk8sWZE')
      }
    }, 25);
  },
};

export default QRScanner;