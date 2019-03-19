import CryptoWalletSDK from 'cryptowallet-js';

export default ({ Vue }) => {
  const SDK = new CryptoWalletSDK();

  console.log(SDK.SDKFactory);

  Vue.prototype.coinSDKS = {
    Bitcoin: SDK.SDKFactory.createSDK('Bitcoin'),
    Ethereum: SDK.SDKFactory.createSDK('Ethereum'),
    ERC20: SDK.SDKFactory.createSDK('ERC20'),
  };
};
