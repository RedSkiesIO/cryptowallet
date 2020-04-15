import ERPC from '@etclabscore/ethereum-json-rpc';
import Address from '@/store/wallet/entities/address';
import Wallet from '@/store/wallet/entities/wallet';
import Tx from '@/store/wallet/entities/tx';
import Utxo from '@/store/wallet/entities/utxo';

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

async function updateBalance(coinSDK, wallet, addresses) {
  const balance = wallet.confirmedBalance;
  let newBalance = 0;

  if (wallet.sdk === 'Bitcoin') {
    const storedUtxos = Utxo.query()
      .where('wallet_id', wallet.id)
      .get()
      .map((utxo) => { return utxo.txid; });
    const utxos = await coinSDK.getUTXOs(addresses, wallet.network);
    const newUtxos = utxos.filter((utxo) => {
      newBalance += utxo.amount;
      utxo.account_id = wallet.account_id;
      utxo.wallet_id = wallet.id;
      return !storedUtxos.includes(utxo.txid);
    });

    if (newUtxos.length > 0) {
      Utxo.$insert({ data: newUtxos });
    }

    const oldUtxos = storedUtxos.filter((utxo) => {
      return !utxos.map((ut) => { return ut.txid; }).includes(utxo);
    });
    oldUtxos.forEach((id) => {
      const utxo = Utxo.query()
        .where('txid', id)
        .get();
      Utxo.$delete(utxo[0].id);
    });
  }

  if (wallet.sdk === 'Ethereum') {
    newBalance = await coinSDK.getBalance(
      [wallet.externalAddress],
      wallet.network,
    );
  }

  if (wallet.sdk === 'Catalyst') {
    newBalance = await coinSDK.getBalance(
      [wallet.externalAddress],
      wallet.network,
    );
  }

  if (wallet.sdk === 'ERC20') {
    newBalance = await coinSDK.getBalance(wallet.erc20Wallet);
  }

  if (newBalance !== balance) {
    Wallet.$update({
      where: (record) => { return record.id === wallet.id; },
      data: { confirmedBalance: parseFloat(newBalance) },
    });
    return true;
  }
  return false;
}

async function removeOldTxs(wallet) {
  const rpc = new ERPC({
    transport: {
      host: '77.68.110.194',
      port: 5005,
      type: 'http',
      path: 'api/eth/request',
    },
  });

  const txs = Tx.query()
    .where('wallet_id', wallet.id)
    .get();

  const deltaHeight = await rpc.eth_blockNumber();
  const maxTime = 240;
  const converToSeconds = 1000;

  const oldTxs = [];

  const removeOld = async (transactions) => {
    const tx = transactions.shift();
    if (tx.blockHeight > deltaHeight) {
      oldTxs.push(tx);
      return;
    }
    if (tx.blockHeight === -1 && ((Date.now() / converToSeconds) - tx.confirmedTime) > maxTime) {
      oldTxs.push(tx);
      return;
    }
    const receipt = await rpc.eth_getTransactionByHash(tx.hash);
    if (!receipt) {
      oldTxs.push(tx);
      return;
    }
    if (transactions.length > 0) { await removeOld(transactions); }
  };
  await removeOld(txs);

  oldTxs.forEach((tx) => {
    Tx.$delete(tx.id);
  });
}

function updateTxs(txs, wallet) {
  txs.forEach((tx) => {
    Tx.$update({
      where: (record) => {
        return record.hash === tx.hash
        && record.wallet_id === wallet.id;
      },
      data: tx,
    });
  });
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

async function storeTxs(txs, wallet, coinSDK) {
  if (wallet.sdk !== 'Bitcoin') {
    const newAmount = 100;
    if (txs.length > newAmount) {
      txs = txs.slice(0, newAmount);
    }
  }

  const storedTxs = await Tx.query().where('wallet_id', wallet.id).get().map((tx) => {
    return tx.hash;
  });
  console.log('storedTxs: ', storedTxs);

  if (storedTxs.length > 0) {
    const foundTxs = txs.filter((tx) => { return storedTxs.includes(tx.hash); });
    const newTxs = txs.filter((tx) => { return !storedTxs.includes(tx.hash); });
    console.log('foundTxs: ', foundTxs);
    console.log('newTxs: ', newTxs);

    updateTxs(foundTxs, wallet);
    if (newTxs.length > 0) {
      insertTxs(newTxs, wallet, coinSDK);
    }
  } else {
    insertTxs(txs, wallet, coinSDK);
  }
}

async function refreshBitcoin(coinSDK, wallet, fullRefresh) {
  const addresses = Address.query()
    .where('wallet_id', wallet.id)
    .get()
    .map((item) => { return item.address; });

  const addressesRaw = addresses.filter(onlyUnique);

  const balanceChanged = await updateBalance(coinSDK, wallet, addressesRaw);

  if (balanceChanged || fullRefresh) {
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
  }
  return balanceChanged;
}

async function refreshEthereum(coinSDK, wallet, fullRefresh) {
  const balanceChanged = await updateBalance(coinSDK, wallet);


  if (balanceChanged || fullRefresh) {
    const { network } = wallet;
    const txHistory = await coinSDK.getTransactionHistory(
      [wallet.externalAddress],
      network,
      0,
    );

    await removeOldTxs(wallet);
    if (!txHistory || txHistory.txs.length === 0) {
      return false;
    }
    await storeTxs(txHistory.txs, wallet, coinSDK);
  }

  return balanceChanged;
}

async function refreshERC20(coinSDK, wallet, fullRefresh) {
  const balanceChanged = await updateBalance(coinSDK, wallet);
  if (balanceChanged || fullRefresh) {
    const txHistory = await coinSDK.getTransactionHistory(wallet.erc20Wallet, 0);
    if (!txHistory || txHistory.length === 0) {
      return false;
    }

    storeTxs(txHistory, wallet, coinSDK);
  }
  return balanceChanged;
}

async function refreshWallet(coinSDK, wallet, accountId, fullRefresh = true) {
  if (wallet.sdk === 'Bitcoin') {
    return refreshBitcoin(coinSDK, wallet, fullRefresh, accountId);
  }

  if (wallet.sdk === 'Ethereum') {
    return refreshEthereum(coinSDK, wallet, fullRefresh, accountId);
  }

  if (wallet.sdk === 'Catalyst') {
    return refreshEthereum(coinSDK, wallet, fullRefresh, accountId);
  }

  if (wallet.sdk === 'ERC20') {
    return refreshERC20(coinSDK, wallet, fullRefresh, accountId);
  }

  return false;
}

export default refreshWallet;
