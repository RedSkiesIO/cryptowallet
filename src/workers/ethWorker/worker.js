import * as Comlink from 'comlink';
import CryptoWalletJs from 'cryptowallet-js';

const crypto = new CryptoWalletJs();

async function updateBalance(wallet, coinSDK, cb) {
  const balance = wallet.confirmedBalance;
  let newBalance = 0;

  if (wallet.sdk === 'Ethereum') {
    newBalance = await coinSDK.getBalance(
      [wallet.externalAddress],
      wallet.network,
    );
  }

  if (wallet.sdk === 'ERC20') {
    newBalance = await coinSDK.getBalance(wallet.erc20Wallet);
  }

  console.log(newBalance);

  if (newBalance !== balance) {
    cb.updateWallet(newBalance);
    return true;
  }
  return false;
}

async function refreshEthereum(coinSDK, wallet, cb, fullRefresh) {
  const balanceChanged = await updateBalance(wallet, coinSDK, cb);
  console.log(fullRefresh);
  if (balanceChanged || fullRefresh) {
    const { network } = wallet;

    const txHistory = await coinSDK.getTransactionHistory(
      [wallet.externalAddress],
      network,
      0,
    );
    console.log(txHistory);

    if (!txHistory || txHistory.txs.length === 0) {
      return false;
    }

    cb.storeTxs(txHistory.txs, wallet);
  }

  return balanceChanged;
}

async function refreshERC20(coinSDK, wallet, cb, fullRefresh) {
  const balanceChanged = await updateBalance(wallet, coinSDK, cb);
  if (balanceChanged || fullRefresh) {
    const txHistory = await coinSDK.getTransactionHistory(wallet.erc20Wallet, 0);
    if (!txHistory || txHistory.length === 0) {
      return false;
    }

    cb.storeTxs(txHistory, wallet);
  }
  return balanceChanged;
}

async function refreshWallet(wallet, cb, fullRefresh = true) {
  const coinSDK = crypto.SDKFactory.createSDK(wallet.sdk);
  if (wallet.sdk === 'Ethereum') {
    return refreshEthereum(coinSDK, wallet, cb, fullRefresh);
  }

  if (wallet.sdk === 'ERC20') {
    return refreshERC20(coinSDK, wallet, cb, fullRefresh);
  }

  return false;
}

Comlink.expose(refreshWallet);
