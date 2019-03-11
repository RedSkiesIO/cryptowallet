import CryptoWalletSDK from 'cryptowallet-js';

export default ({ Vue }) => {
  const SDK = new CryptoWalletSDK();

  Vue.prototype.coinSDKS = {
    Bitcoin: SDK.SDKFactory.default.createSDK('Bitcoin'),
    Ethereum: SDK.SDKFactory.default.createSDK('Ethereum'),
    ERC20: SDK.SDKFactory.default.createSDK('ERC20'),
  };
};
