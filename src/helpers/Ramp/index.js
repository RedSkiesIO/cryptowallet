import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk';

export function ramp(account, wallet, testnet = true) {
  const config = {
    hostAppName: 'Cent',
    hostLogoUrl: 'https://ramp-website.netlify.app/assets/images/Logo.svg',
    // swapAsset: wallet.symbol,
    userAddress: wallet.externalAddress,
    userEmailAddress: account.email || '',
    variant: 'mobile',
  };
  if (testnet) { config.url = 'https://ri-widget-staging.firebaseapp.com/'; }

  return new RampInstantSDK(config);
}
