import { BrowserQRCodeReader } from '@zxing/library';

export default ({ Vue }) => {
  Vue.prototype.codeReader = new BrowserQRCodeReader();
};
