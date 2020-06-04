import TransakSDK from '@transak/transak-sdk';

export function transak(wallet, country, card = false, testnet = true) {
  return new TransakSDK({
    apiKey: process.env.TRANSAK_API_KEY, // Your API Key
    environment: testnet ? 'STAGING' : 'PRODUCTION', // STAGING/PRODUCTION
    cryptoCurrencyCode: wallet.symbol,
    walletAddress: wallet.externalAddress, // Your customer's wallet address
    disableWalletAddressForm: true,
    themeColor: '#1e3c57', // App theme color
    fiatCurrency: country.currencyCode, // INR/GBP
    countryCode: country.alpha2,
    defaultPaymentMethod: card ? 'credit_debit_card' : '',
    email: '', // Your customer's email address
    redirectURL: window.location.origin,
    hostURL: window.location.origin,
    widgetHeight: '100%',
    widgetWidth: '100%',
    hideMenu: true,
    exchangeScreenTitle: `Buy ${wallet.symbol.toUpperCase()}`,
  });
}
