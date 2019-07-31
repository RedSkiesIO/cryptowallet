const QRScanner = {
  mockBehaviour: null,
  delay: 25,
  scan(callback) {
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
        callback(null, '2NCQfWAPZ2bCWNhsVWvu9retMFBnfk8sWZE');
      }

      if (this.mockBehaviour === 3) {
        callback(null, '0xcda4cddb41b60fd84252912967397df7d3c1bfdd');
      }

      if (this.mockBehaviour === 4) {
        callback(null, 'bitcoin:2NGBz7mknbB1GxFSddxa47C3S6qS4FuTnyd?amount=5');
      }

      if (this.mockBehaviour === 5) {
        callback(null, 'ethereum:0xcda4cddb41b60fd84252912967397df7d3c1bfde?amount=5');
      }
    }, this.delay);
  },
};

export default QRScanner;
