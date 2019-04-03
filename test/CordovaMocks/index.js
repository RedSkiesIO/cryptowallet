import permissions from './permissions';
import contacts from './contacts';
import Sms from './sms';
import Email from './email';
import clipboard from './clipboard';
import QRScanner from './qrscanner';

export default {
  initMocks() {
    const navigator = { contacts };
    const cordova = {
      plugins: {
        permissions,
        clipboard,
        email: new Email(),
      },
    };

    global.cordova = cordova;
    global.ContactFindOptions = function () {};
    global.navigator = navigator;
    global.sms = new Sms();
    global.QRScanner = QRScanner;
  },
  destroyMocks() {
    delete global.cordova;
    delete global.ContactFindOptions;
    delete global.navigator;
    delete global.sms;
  },
};
