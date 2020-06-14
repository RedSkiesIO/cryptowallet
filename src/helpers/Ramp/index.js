import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk';

export function ramp(wallet, testnet = true) {
  const config = {
    hostAppName: 'Cent',
    hostLogoUrl: 'https://cdn-images-1.medium.com/max/2600/1*nqtMwugX7TtpcS-5c3lRjw.png',
    swapAsset: wallet.symbol,
    userAddress: wallet.externalAddress,
    variant: 'mobile',
  };

  if (testnet) { config.url = 'https://ri-widget-staging.firebaseapp.com/'; }

  return new RampInstantSDK(config);
}
