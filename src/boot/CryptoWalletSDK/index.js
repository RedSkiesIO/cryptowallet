import * as CryptoWalletSDK from 'cryptowallet-js';

export default async ({ Vue }) => {
  const CryptoWallet = await CryptoWalletSDK.default();
  // eslint-disable-next-line new-cap
  const SDK = new CryptoWallet.default();

  Vue.prototype.coinSDKS = {
    Bitcoin: SDK.SDKFactory.createSDK('Bitcoin'),
    Ethereum: SDK.SDKFactory.createSDK('Ethereum'),
    Catalyst: SDK.SDKFactory.createSDK('Catalyst'),
    ERC20: SDK.SDKFactory.createSDK('ERC20'),
  };
};
