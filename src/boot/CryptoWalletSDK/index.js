import CryptoWalletSDK from 'cryptowallet-js';
import networks from '../../store/settings/state/supportedNetworks';

export default ({ Vue }) => {
  const SDK = new CryptoWalletSDK();

  Vue.prototype.coinSDKS = {
    Bitcoin: SDK.SDKFactory.createSDK('Bitcoin'),
    Ethereum: SDK.SDKFactory.createSDK('Ethereum', networks.ETHERUM_ROPSTEN),
    ERC20: SDK.SDKFactory.createSDK('ERC20'),
  };
};
