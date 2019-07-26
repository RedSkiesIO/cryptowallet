import * as Comlink from 'comlink';
import CryptoWalletJs from 'cryptowallet-js';

const crypto = new CryptoWalletJs();

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

async function updateBalance(wallet, coinSDK, cb, addresses) {
  const balance = wallet.confirmedBalance;
  let newBalance = 0;

  if (wallet.sdk === 'Bitcoin') {
    const storedUtxos = await cb.getUtxos(wallet.id);
    const utxos = await coinSDK.getUTXOs(addresses, wallet.network);
    const newUtxos = utxos.filter((utxo) => {
      newBalance += utxo.amount;
      utxo.account_id = wallet.account_id;
      utxo.wallet_id = wallet.id;
      return !storedUtxos.includes(utxo.txid);
    });

    if (newUtxos.length > 0) {
      await cb.insertUtxos(newUtxos);
    }

    const oldUtxos = storedUtxos.filter((utxo) => {
      return !utxos.map((ut) => { return ut.txid; }).includes(utxo);
    });
    const promises = oldUtxos.map((id) => {
      return cb.deleteUtxo(id);
    });
    await Promise.all(promises);
  }

  if (wallet.sdk === 'Ethereum') {
    newBalance = await coinSDK.getBalance(
      [wallet.externalAddress],
      wallet.network,
    );
  }

  if (wallet.sdk === 'ERC20') {
    newBalance = await coinSDK.getBalance(wallet.erc20Wallet);
  }

  if (newBalance !== balance) {
    await cb.updateWallet(wallet.id, { newBalance });
    return true;
  }
  return false;
}

async function insertTxs(txs, wallet, coinSDK, cb) {
  const transactions = txs.map((tx) => {
    tx.account_id = wallet.account_id;
    tx.wallet_id = wallet.id;
    return tx;
  });

  await cb.insertTxs(transactions);

  // update external address
  if (wallet.sdk === 'Bitcoin') {
    const newExternalAddress = txs.some((tx) => {
      return tx.receiver.includes(wallet.externalAddress);
    });

    if (newExternalAddress) {
      // generate new address
      const addr = await coinSDK.generateAddress(
        wallet.hdWallet, wallet.externalChainAddressIndex + 1,
      );

      const newAddress = {
        account_id: wallet.account_id,
        wallet_id: wallet.id,
        chain: 'external',
        address: addr.address,
        index: addr.index,
      };

      await cb.insertAddress(newAddress);
      await cb.updateWallet(wallet.id, { addr });
    }
  }
}

async function storeTxs(txs, wallet, coinSDK, cb) {
  if (wallet.sdk !== 'Bitcoin') {
    const newAmount = 100;
    if (txs.length > newAmount) {
      txs = txs.slice(0, newAmount);
    }
  }

  const storedTxs = await cb.getTxs(wallet.id);
  if (storedTxs.length > 0) {
    const foundTxs = txs.filter((tx) => { return storedTxs.includes(tx.hash); });
    const newTxs = txs.filter((tx) => { return !storedTxs.includes(tx.hash); });

    await cb.updateTxs(foundTxs, wallet.id);
    if (newTxs.length > 0) {
      await insertTxs(newTxs, wallet, coinSDK, cb);
    }
  } else {
    await insertTxs(txs, wallet, coinSDK, cb);
  }
}

async function refreshBitcoin(coinSDK, wallet, cb, fullRefresh) {
  const addresses = await cb.getAddresses(wallet.id);

  const addressesRaw = addresses.filter(onlyUnique);

  const balanceChanged = await updateBalance(wallet, coinSDK, cb, addressesRaw);

  if (balanceChanged || fullRefresh) {
    const txs = await cb.getTxs(wallet.id);
    const txAmount = txs.length;
    const apiReturnLimit = 50;
    const newAmount = 5;
    const moreTxsThanLimit = apiReturnLimit <= txAmount;
    const from = moreTxsThanLimit ? (Math.max(0, (txAmount - apiReturnLimit)) + newAmount) : 0;
    const to = moreTxsThanLimit ? (from + apiReturnLimit) : apiReturnLimit;
    const txHistory = await coinSDK.getTransactionHistory(
      addressesRaw,
      wallet.network,
      from,
      to,
    );

    if (!txHistory || !txHistory.txs || txHistory.txs.length === 0) {
      return false;
    }

    storeTxs(txHistory.txs, wallet, coinSDK, cb);
  }
  return balanceChanged;
}

async function refreshEthereum(coinSDK, wallet, cb, fullRefresh) {
  const balanceChanged = await updateBalance(wallet, coinSDK, cb);
  if (balanceChanged || fullRefresh) {
    const { network } = wallet;

    const txHistory = await coinSDK.getTransactionHistory(
      [wallet.externalAddress],
      network,
      0,
    );

    if (!txHistory || txHistory.txs.length === 0) {
      return false;
    }

    storeTxs(txHistory.txs, wallet, coinSDK, cb);
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

    storeTxs(txHistory, wallet, coinSDK, cb);
  }
  return balanceChanged;
}

async function refreshWallet(wallet, cb, fullRefresh = true) {
  const coinSDK = crypto.SDKFactory.createSDK(wallet.sdk);

  if (wallet.sdk === 'Bitcoin') {
    return refreshBitcoin(coinSDK, wallet, cb, fullRefresh);
  }

  if (wallet.sdk === 'Ethereum') {
    return refreshEthereum(coinSDK, wallet, cb, fullRefresh);
  }

  if (wallet.sdk === 'ERC20') {
    return refreshERC20(coinSDK, wallet, cb, fullRefresh);
  }

  return false;
}

Comlink.expose(refreshWallet);
export default refreshWallet;
