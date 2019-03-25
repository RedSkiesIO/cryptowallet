/* eslint-disable max-len */
// import { uid } from 'quasar';
// import { store } from '@/store/index';
// import Account from '@/store/wallet/entities/account';
// import Wallet from '@/store/wallet/entities/wallet';
// import CryptoWalletSDK from 'cryptowallet-js';
// import bcrypt from 'bcryptjs';

// // export async function complete() {
// //   Object.getPrototypeOf(this.$root).backEndService = new this.BackEndService(this.$root, id, this.setup.pinArray.join(''));
// //   await this.backEndService.connect();
// //   await this.backEndService.loadPriceFeed();
// //   this.$store.dispatch('settings/setAuthenticatedAccount', id);
// //   this.$store.dispatch('settings/setLayout', 'light');
// //   this.$router.push({ path: '/wallet' });
// //   this.$store.dispatch('setup/clearSetupData');
// //   this.$store.dispatch('settings/setLoading', false);
// // }

// export async function createAccount(setup) {
//   const accounts = store.getters['entities/account/query']().get();
//   const password = setup.pinArray.join('');
//   const pinHash = bcrypt.hashSync(password, setup.salt);
//   const data = {
//     uid: uid(),
//     name: setup.accountName,
//     salt: setup.salt,
//     pinHash,
//     default: accounts.length === 0,
//     locale: setup.accountLocale || accounts[0].locale,
//     node: setup.accountIpNode,
//     seed: Object.values(setup.seed),
//   };

//   store.dispatch('settings/setSelectedAccount', data.name);
//   const result = await Account.$insert({
//     data,
//     password,
//   });

//   return {
//     id: result.account[0],
//   };
// }

// export async function createWallets(setup, id, coins) {
//   const password = setup.pinArray.join('');
//   const SDK = new CryptoWalletSDK();
//   // const { id } = result.account[0];
//   const promises = [];
//   // const erc20Promises = [];

//   coins.forEach((coin) => {
//     const wallet = {
//       account_id: id,
//       name: coin.name,
//       displayName: coin.displayName,
//       symbol: coin.symbol,
//       sdk: coin.sdk,
//       network: coin.network,
//     };

//     if (coin.sdk !== 'ERC20') {
//       promises.push(new Promise(async (resolve) => {
//         const coinSDK = SDK.SDKFactory.createSDK(coin.sdk);
//         wallet.hdWallet = await coinSDK.generateHDWallet(
//           Object.values(setup.seed).join(' ').trim(),
//           coin.network,
//         );
//         await Wallet.$insert({ data: wallet, password });
//         resolve();
//       }));
//     }
//   });

//   await Promise.all(promises);
// //   await Promise.all(erc20Promises);
// }

// export async function createERC20Wallets(setup, id, coins) {
//   const SDK = new CryptoWalletSDK();
//   const promises = [];

//   coins.forEach((coin) => {
//     if (coin.sdk === 'ERC20') {
//       const wallet = {
//         account_id: id,
//         name: coin.name,
//         displayName: coin.displayName,
//         symbol: coin.symbol,
//         sdk: coin.sdk,
//         network: coin.network,
//       };
//       promises.push(new Promise(async (resolve) => {
//         const coinSDK = SDK.SDKFactory.createSDK(coin.sdk);
//         const parentSDK = await SDK.SDKFactory.createSDK(coin.parentSdk);
//         const parentWallet = await parentSDK.generateHDWallet(
//           Object.values(setup.seed).join(' ').trim(),
//           coin.network,
//         );
//         const keyPair = parentSDK.generateKeyPair(parentWallet, 0);

//         wallet.erc20Wallet = await coinSDK.generateERC20Wallet(
//           keyPair,
//           coin.name,
//           coin.symbol,
//           coin.contractAddress,
//           coin.decimals,
//         );

//         wallet.parentSdk = coin.parentSdk;
//         wallet.parentName = coin.parentName;
//         wallet.contractAddress = coin.contractAddress;
//         wallet.decimals = coin.decimals;

//         await Wallet.$insert({ data: wallet });
//         resolve();
//       }));
//     }
//   });
//   await Promise.all(promises);
// }
