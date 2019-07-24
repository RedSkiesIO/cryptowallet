// import * as Comlink from 'comlink';
// import CryptoWalletJs from 'cryptowallet-js';
// import Web3 from 'web3';

let checkForUpdates = null;
const interval = 15000;

// const WalletWorker = {
//   checkBalance() {
checkForUpdates = setInterval(() => {
  const time = new Date().getTime();
  if (time - this.startTime > this.timeout) {
    clearInterval(checkForUpdates);
  }
  postMessage('something');
}, interval);
//   },
// };

// Comlink.expose(WalletWorker);
