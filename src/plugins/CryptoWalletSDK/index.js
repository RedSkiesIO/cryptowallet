import CryptoWalletSDK from 'cryptowallet-js';

export default ({ Vue }) => {
  Vue.prototype.CryptoWalletSDK = new CryptoWalletSDK();
};
