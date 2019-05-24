import Address from '@/store/wallet/entities/address';
import Wallet from '@/store/wallet/entities/wallet';
import Tx from '@/store/wallet/entities/tx';
import Utxo from '@/store/wallet/entities/utxo';

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

async function refreshBitcoin(coinSDK, wallet, accountId) {
  const addresses = Address.query()
    .where('account_id', accountId)
    .where('wallet_id', wallet.id)
    .where('used', false)
    .get();

  let addressesRaw = addresses.map((item) => { return item.address; });
  addressesRaw = addressesRaw.filter(onlyUnique);

  const { network } = wallet;

  const txs = Tx.query()
    .where('account_id', accountId)
    .where('wallet_id', wallet.id)
    .get();

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

  txHistory.txs.forEach((tx) => {
    const result = Tx.query()
      .where('hash', tx.hash)
      .where('wallet_id', wallet.id)
      .get();

    if (result[0]) {
      // update the tx
      Tx.$update({
        where: (record) => {
          return record.hash === tx.hash
          && record.wallet_id === wallet.id;
        },
        data: tx,
      });

      const foundTx = result[0];
      if (foundTx.sent) {
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
    } else {
      // insert tx
      Tx.$insert({
        data: {
          account_id: accountId,
          wallet_id: wallet.id,
          ...tx,
        },
      });

      // update external address
      if (tx.receiver.includes(wallet.externalAddress)) {
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
  });


  const utxos = await coinSDK.getUTXOs(
    addressesRaw,
    wallet.network,
  );
  let newBalance = 0;
  utxos.forEach((utxo) => {
    newBalance += utxo.amount;
    const found = Utxo.query()
      .where('txid', utxo.txid)
      .where('vout', utxo.vout)
      .where('wallet_id', wallet.id)
      .get();

    if (!found[0]) {
      utxo.account_id = accountId;
      utxo.wallet_id = wallet.id;
      Utxo.$insert({ data: utxo });
    }
  });

  Wallet.$update({
    where: (record) => { return record.id === wallet.id; },
    data: { confirmedBalance: parseFloat(newBalance, 10) },
  });

  return true;
}

async function refreshEthereum(coinSDK, wallet, accountId) {
  const { network } = wallet;

  const apiReturnLimit = 50;
  const txHistory = await coinSDK.getTransactionHistory(
    [wallet.externalAddress],
    network,
    0,
    apiReturnLimit,
  );

  if (!txHistory) {
    return false;
  }


  txHistory.txs.forEach((tx) => {
    const result = Tx.query()
      .where('hash', tx.hash)
      .where('wallet_id', wallet.id)
      .get();

    if (result[0]) {
      // update the tx
      Tx.$update({
        where: (record) => {
          return record.hash === tx.hash
            && record.wallet_id === wallet.id;
        },
        data: tx,
      });
    } else {
      // insert tx
      Tx.$insert({
        data: {
          account_id: accountId,
          wallet_id: wallet.id,
          ...tx,
        },
      });
    }
  });

  const newBalance = await coinSDK.getBalance(
    [wallet.externalAddress],
    wallet.network,
  );

  Wallet.$update({
    where: (record) => { return record.id === wallet.id; },
    data: { confirmedBalance: parseFloat(newBalance, 10) },
  });

  return true;
}

async function refreshERC20(coinSDK, wallet, accountId) {
  const txHistory = await coinSDK.getTransactionHistory(wallet.erc20Wallet, 0);

  if (!txHistory) {
    return false;
  }

  txHistory.forEach((tx) => {
    const result = Tx.query()
      .where('hash', tx.hash)
      .where('wallet_id', wallet.id)
      .get();

    if (result[0]) {
      // update the tx
      Tx.$update({
        where: (record) => {
          return record.hash === tx.hash
            && record.wallet_id === wallet.id;
        },
        data: tx,
      });
    } else {
      // insert tx
      Tx.$insert({
        data: {
          account_id: accountId,
          wallet_id: wallet.id,
          ...tx,
        },
      });
    }
  });

  const newBalance = await coinSDK.getBalance(wallet.erc20Wallet);

  Wallet.$update({
    where: (record) => { return record.id === wallet.id; },
    data: { confirmedBalance: parseFloat(newBalance, 10) },
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
