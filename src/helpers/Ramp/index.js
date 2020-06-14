import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk';

export function ramp(wallet, testnet = true) {
  const config = {
    hostAppName: 'Cent',
    hostLogoUrl: `${window.location.origin}/statics/payment-logos/ramp.svg`,
    swapAsset: wallet.symbol,
    userAddress: wallet.externalAddress,
    variant: 'mobile',
  };

  if (testnet) { config.url = 'https://ri-widget-staging.firebaseapp.com/'; }

  return new RampInstantSDK(config);
}
