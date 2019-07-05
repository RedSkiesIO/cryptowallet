import Address from '@/store/wallet/entities/address';
import Wallet from '@/store/wallet/entities/wallet';
import Tx from '@/store/wallet/entities/tx';
import Utxo from '@/store/wallet/entities/utxo';

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function updateTxs(txs, wallet) {
  const sentTxs = txs.map((tx) => {
    Tx.$update({
      where: (record) => {
        return record.hash === tx.hash
        && record.wallet_id === wallet.id;
      },
      data: tx,
    });
    return tx.sent ? tx.hash : [];
  });

  if (wallet.sdk === 'Bitcoin') {
    const pendingUtxos = Utxo.query()
      .where('wallet_id', wallet.id)
      .where('pending', true)
      .get();

    pendingUtxos.forEach((utxo) => {
      if (sentTxs.includes(utxo.spentHash)) {
        Utxo.$delete(utxo.id);
      }
    });
  }
}

function insertTxs(txs, wallet, coinSDK) {
  const transactions = txs.map((tx) => {
    tx.account_id = wallet.account_id;
    tx.wallet_id = wallet.id;
    return tx;
  });

  Tx.$insert({
    data: transactions,
  });

  // update external address
  if (wallet.sdk === 'Bitcoin') {
    const newExternalAddress = txs.some((tx) => {
      return tx.receiver.includes(wallet.externalAddress);
    });

    if (newExternalAddress) {
      // generate new address
      const addr = coinSDK.generateAddress(wallet.hdWallet, wallet.externalChainAddressIndex + 1);

      const newAddress = {
        account_id: wallet.account_id,
        wallet_id: wallet.id,
        chain: 'external',
        address: addr.address,
        index: addr.index,
      };

      Address.$insert({ data: newAddress });

      Wallet.$update({
        where: (record) => { return record.id === wallet.id; },
        data: {
          externalChainAddressIndex: addr.index,
          externalAddress: addr.address,
        },
      });
    }
  }
}

function storeTxs(txs, wallet, coinSDK) {
  if (wallet.sdk !== 'Bitcoin') {
    const newAmount = 100;
    if (txs.length > newAmount) {
      txs = txs.slice(0, newAmount);
    }
  }

  const storedTxs = Tx.query().where('wallet_id', wallet.id).get().map((tx) => {
    return tx.hash;
  });

  if (storedTxs.length > 0) {
    const foundTxs = txs.filter((tx) => { return storedTxs.includes(tx.hash); });
    const newTxs = txs.filter((tx) => { return !storedTxs.includes(tx.hash); });

    updateTxs(foundTxs, wallet);
    if (newTxs.length > 0) {
      insertTxs(newTxs, wallet, coinSDK);
    }
  } else {
    insertTxs(txs, wallet, coinSDK);
  }
}

async function refreshBitcoin(coinSDK, wallet) {
  const addresses = Address.query()
    .where('wallet_id', wallet.id)
    .get()
    .map((item) => { return item.address; });

  const addressesRaw = addresses.filter(onlyUnique);
  const txAmount = Tx.query().where('wallet_id', wallet.id).get().length;
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

  if (!txHistory) {
    return false;
  }

  storeTxs(txHistory.txs, wallet, coinSDK);

  let newBalance = 0;

  const storedUtxos = Utxo.query()
    .where('wallet_id', wallet.id)
    .get()
    .map((utxo) => { return utxo.txid; });
  const utxos = await coinSDK.getUTXOs(addressesRaw, wallet.network);
  const newUtxos = utxos.filter((utxo) => {
    newBalance += utxo.amount;
    utxo.account_id = wallet.account_id;
    utxo.wallet_id = wallet.id;
    return !storedUtxos.includes(utxo.txid);
  });

  if (newUtxos.length > 0) {
    Utxo.$insert({ data: newUtxos });
  }

  Wallet.$update({
    where: (record) => { return record.id === wallet.id; },
    data: { confirmedBalance: parseFloat(newBalance) },
  });

  return true;
}

async function refreshEthereum(coinSDK, wallet) {
  const { network } = wallet;

  const txHistory = await coinSDK.getTransactionHistory(
    [wallet.externalAddress],
    network,
    0,
  );

  if (!txHistory || txHistory.txs.length === 0) {
    return false;
  }

  storeTxs(txHistory.txs, wallet, coinSDK);

  const newBalance = await coinSDK.getBalance(
    [wallet.externalAddress],
    wallet.network,
  );

  Wallet.$update({
    where: (record) => { return record.id === wallet.id; },
    data: { confirmedBalance: parseFloat(newBalance) },
  });

  return true;
}

async function refreshERC20(coinSDK, wallet) {
  const txHistory = await coinSDK.getTransactionHistory(wallet.erc20Wallet, 0);
  if (!txHistory || txHistory.length === 0) {
    return false;
  }

  storeTxs(txHistory, wallet, coinSDK);

  const newBalance = await coinSDK.getBalance(wallet.erc20Wallet);

  Wallet.$update({
    where: (record) => { return record.id === wallet.id; },
    data: { confirmedBalance: parseFloat(newBalance) },
  });

  return true;
}

async function refreshWallet(coinSDK, wallet, accountId) {
  if (wallet.sdk === 'Bitcoin') {
    await refreshBitcoin(coinSDK, wallet, accountId);
  }

  if (wallet.sdk === 'Ethereum') {
    await refreshEthereum(coinSDK, wallet, accountId);
  }

  if (wallet.sdk === 'ERC20') {
    await refreshERC20(coinSDK, wallet, accountId);
  }

  return false;
}

export default refreshWallet;
