// eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from 'worker-loader!@/workers/ethWorker/worker';
import * as Comlink from 'comlink';
// import Address from '@/store/wallet/entities/address';
import Wallet from '@/store/wallet/entities/wallet';
import Tx from '@/store/wallet/entities/tx';

// import Tx from '@/store/wallet/entities/tx';
// class ethWorker {


// constructor(accountId) {
//   this.accountId = accountId;
// }

// messageHandler(e) {
//   this.worker = 'something';
//   console.log(e.data);
// }

// errorHandler(e) {
//   this.worker = 'something';
// }

// newBalance(newBalance) {
//   Wallet.$update({
//     where: (record) => { return record.id === wallet.id; },
//     data: { confirmedBalance: parseFloat(newBalance) },
//   });
//   this.worker.postMesage(['updateWallets', this.wallets]);
// }

// createWorker() {
//   this.worker = new Worker();
//   this.worker.onmessage = (e) => { return this.messageHandler(e); };
//   this.worker.onerror = (e) => { return this.errorHandler(e); };
// }

// stop() {
//   this.worker.terminate();
// }
// }
const worker = new Worker();
const ethWorker = Comlink.wrap(worker);

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

function insertTxs(txs, wallet) {
  const transactions = txs.map((tx) => {
    tx.account_id = wallet.account_id;
    tx.wallet_id = wallet.id;
    return tx;
  });

  Tx.$insert({
    data: transactions,
  });
}

function storeTxs(txs, wallet) {
  const storedTxs = Tx.query().where('wallet_id', wallet.id).get().map((tx) => {
    return tx.hash;
  });

  if (storedTxs.length > 0) {
    const foundTxs = txs.filter((tx) => { return storedTxs.includes(tx.hash); });
    const newTxs = txs.filter((tx) => { return !storedTxs.includes(tx.hash); });

    updateTxs(foundTxs, wallet);
    if (newTxs.length > 0) {
      insertTxs(newTxs, wallet);
    }
  } else {
    insertTxs(txs, wallet);
  }
}

function updateWallet(wallet, newBalance) {
  Wallet.$update({
    where: (record) => { return record.id === wallet.id; },
    data: { confirmedBalance: parseFloat(newBalance) },
  });

  return wallet;
}

async function refreshWallet(wallet, fullRefresh = true) {
  console.log(fullRefresh);
  const func = {
    updateWallet,
    storeTxs,
  };

  const refresh = await ethWorker(wallet, Comlink.proxy(func), fullRefresh);
  return refresh;
}

export default refreshWallet;
