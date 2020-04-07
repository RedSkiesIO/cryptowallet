import { BrowserQRCodeReader } from '@zxing/library';

export default ({ Vue }) => {
  Vue.prototype.$QRScanner = BrowserQRCodeReader;
};
