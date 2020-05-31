import TransakSDK from '@transak/transak-sdk';

export function transak(wallet, account) {
  return new TransakSDK({
    apiKey: process.env.TRANSAK_API_KEY, // Your API Key
    environment: 'STAGING', // STAGING/PRODUCTION
    cryptoCurrencyCode: wallet.symbol,
    walletAddress: wallet.externalAddress, // Your customer's wallet address
    disableWalletAddressForm: true,
    themeColor: '#1e3c57', // App theme color
    fiatCurrency: account.currency, // INR/GBP
    countryCode: 'UK',
    email: '', // Your customer's email address
    redirectURL: '',
    hostURL: window.location.origin,
    widgetHeight: '100%',
    widgetWidth: '100%',
    hideMenu: true,
    exchangeScreenTitle: `Buy ${wallet.symbol.toUpperCase()}`,
  });
//   console.log(wallet, account);
//   return new TransakSDK({
//     apiKey: '4fcd6904-706b-4aff-bd9d-77422813bbb7', // Your API Key
//     environment: 'STAGING', // STAGING/PRODUCTION
//     defaultCryptoCurrency: 'ETH',
//     walletAddress: '', // Your customer's wallet address
//     themeColor: '000000', // App theme color
//     fiatCurrency: '', // INR/GBP
//     email: '', // Your customer's email address
//     redirectURL: '',
//     hostURL: window.location.origin,
//     widgetHeight: '550px',
//     widgetWidth: '450px',
//   });
}

// transak.init();

// // To get all the events
// transak.on(transak.ALL_EVENTS, (data) => {
//   console.log(data);
// });

// // This will trigger when the user marks payment is made.
// transak.on(transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
//   console.log(orderData);
//   transak.close();
// });
