import Utxo from '@/store/wallet/entities/utxo';
import Tx from '@/store/wallet/entities/tx';

function getConfirmed(walletId, accountId) {
  let balance = 0;

  const utxos = Utxo.query()
    .where('account_id', accountId)
    .where('wallet_id', walletId)
    .get();

  utxos.forEach((utxo) => {
    balance += utxo.amount;
  });

  return balance;
}

function getUnconfrimed(walletId, accountId) {
  let balance = 0;

  const utxos = Utxo.query()
    .where('account_id', accountId)
    .where('wallet_id', walletId)
    .get();

  utxos.forEach((utxo) => {
    balance += utxo.amount;
  });

  const txs = Tx.query()
    .where('account_id', accountId)
    .where('wallet_id', walletId)
    .get();

  txs.forEach((tx) => {
    if (tx.confirmations === 0) {
      balance -= (tx.fee + tx.value);
    }
  });

  return balance;
}

function getAvailable(walletId, accountId) {
  let balance = 0;

  const utxos = Utxo.query()
    .where('account_id', accountId)
    .where('wallet_id', walletId)
    .get();

  utxos.forEach((utxo) => {
    if (!utxo.pending) {
      balance += utxo.amount;
    }
  });

  return balance;
}


function getBalance(wallet, accountId) {
  if (wallet.sdk === 'Bitcoin') {
    return {
      confirmed: getConfirmed(wallet.id, accountId),
      unconfirmed: getUnconfrimed(wallet.id, accountId),
      available: getAvailable(wallet.id, accountId),
    };
  }

  if (wallet.sdk === 'Ethereum') {
    return {
      confirmed: 0,
      unconfirmed: 0,
      available: 0,
    };
  }

  return false;
}

export default getBalance;
