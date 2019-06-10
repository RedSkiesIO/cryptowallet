import Address from '@/store/wallet/entities/address';
import Wallet from '@/store/wallet/entities/wallet';
import Tx from '@/store/wallet/entities/tx';
import Utxo from '@/store/wallet/entities/utxo';

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function updateTxs(txs, wallet) {
  const tx = txs.shift();
  Tx.$update({
    where: (record) => {
      return record.hash === tx.hash
      && record.wallet_id === wallet.id;
    },
    data: tx,
  });
  if (wallet.sdk === 'Bitcoin' && tx.sent) {
    // delete utxo that were used for that transaction
    tx.sender.forEach((inputAddress) => {
      const pendingUtxo = Utxo.query()
        .where('address', inputAddress)
        .where('pending', true)
        .get();
      pendingUtxo.forEach((pending) => {
        Utxo.$delete(pending.id);
      });
    });

    // find change address that were used and mark them as used
    tx.receiver.forEach((changeAddress) => {
      Address.$update({
        where: (record) => {
          return record.chain === 'internal'
          && record.address === changeAddress;
        },
        data: { used: true },
      });
    });
  }

  if (txs.length > 0) {
    updateTxs(txs, wallet);
  }
}

function insertTxs(txs, wallet, coinSDK) {
  const tx = txs.shift();

  Tx.$insert({
    data: {
      account_id: wallet.account_id,
      wallet_id: wallet.id,
      ...tx,
    },
  });

  // update external address
  if (wallet.sdk === 'Bitcoin' && tx.receiver.includes(wallet.externalAddress)) {
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
  if (txs.length > 0) {
    insertTxs(txs, wallet, coinSDK);
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
    insertTxs(newTxs, wallet, coinSDK);
  } else {
    insertTxs(txs, wallet, coinSDK);
  }
}

async function refreshBitcoin(coinSDK, wallet) {
  const addresses = Address.query()
    .where('wallet_id', wallet.id)
    .where('used', false)
    .get()
    .map((item) => { return item.address; });

  const addressesRaw = addresses.filter(onlyUnique);

  const { network } = wallet;

  const txs = Tx.query().where('wallet_id', wallet.id).get();

  let from;
  let to;
  const apiReturnLimit = 50;
  const newAmount = 5;
  if (apiReturnLimit <= txs.length) {
    from = Math.max(0, (txs.length - apiReturnLimit)) + newAmount;
    to = from + apiReturnLimit;
  } else {
    from = 0;
    to = apiReturnLimit;
  }

  const txHistory = await coinSDK.getTransactionHistory(
    addressesRaw,
    network,
    from,
    to,
  );

  if (!txHistory) {
    return false;
  }

  storeTxs(txHistory.txs, wallet, coinSDK);
  const utxos = await coinSDK.getUTXOs(
    addressesRaw,
    wallet.network,
  );
  let newBalance = 0;

  const storedUtxos = Utxo.query()
    .where('wallet_id', wallet.id)
    .get()
    .map((utxo) => { return utxo.txid; });

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

  if (!txHistory) {
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

  if (!txHistory) {
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
