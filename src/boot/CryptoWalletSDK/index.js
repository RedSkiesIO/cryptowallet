import * as CryptoWalletSDK from 'cryptowallet-js';

export default async ({ Vue }) => {
  console.log(CryptoWalletSDK);

  const CryptoWallet = await CryptoWalletSDK.default();
  console.log(CryptoWallet);
  // const test = CryptoWallet.default;
  // console.log(test);

  // eslint-disable-next-line new-cap
  const SDK = new CryptoWallet.default();
  console.log(SDK);

  Vue.prototype.coinSDKS = {
    Bitcoin: SDK.SDKFactory.createSDK('Bitcoin'),
    Ethereum: SDK.SDKFactory.createSDK('Ethereum'),
    Catalyst: SDK.SDKFactory.createSDK('Catalyst'),
    ERC20: SDK.SDKFactory.createSDK('ERC20'),
  };
};
