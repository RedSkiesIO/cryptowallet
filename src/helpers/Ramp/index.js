import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk';

export function ramp(wallet, testnet = true) {
  const config = {
    hostAppName: 'Cent',
    hostLogoUrl: 'https://buy.ramp.network/2a657d57cb65eed92ed92e48876f497d.svg',
    swapAsset: wallet.symbol,
    userAddress: wallet.externalAddress,
    variant: 'mobile',
  };

  if (testnet) { config.url = 'https://ri-widget-staging.firebaseapp.com/'; }

  return new RampInstantSDK(config);
}
