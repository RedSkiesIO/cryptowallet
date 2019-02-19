import CryptoWalletSDK from 'cryptowallet-js';

export default ({ Vue }) => {
  const SDK = new CryptoWalletSDK();

  Vue.prototype.coinSDKS = {
    Bitcoin: SDK.SDKFactory.CryptoWallet.createSDK('Bitcoin'),
    Ethereum: SDK.SDKFactory.CryptoWallet.createSDK('Ethereum'),
    ERC20: SDK.SDKFactory.CryptoWallet.createSDK('ERC20'),
  };
};
