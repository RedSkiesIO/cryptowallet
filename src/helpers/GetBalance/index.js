import Utxo from '@/store/wallet/entities/utxo';
import Tx from '@/store/wallet/entities/tx';
import Wallet from '@/store/wallet/entities/wallet';

function getConfirmedBitcoin(walletId, accountId) {
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

function getUnconfrimedBitcoin(walletId, accountId) {
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

function getAvailableBitcoin(walletId, accountId) {
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

function getConfirmedEthereum(walletId, accountId) {
  const wallet = Wallet.query()
    .where('account_id', accountId)
    .where('id', walletId)
    .get();

  return wallet[0].confirmedBalance;
}

function getUnconfrimedEthereum(walletId, accountId) {
  const wallet = Wallet.query()
    .where('account_id', accountId)
    .where('id', walletId)
    .get();

  let balance = wallet[0].confirmedBalance;

  const txs = Tx.query()
    .where('account_id', accountId)
    .where('wallet_id', walletId)
    .get();

  txs.forEach((tx) => {
    if (tx.confirmations === 0) {
      balance -= (parseFloat(tx.fee) + parseFloat(tx.value));
    }
  });

  return balance;
}

function getAvailableEthereum(walletId, accountId) {
  const wallet = Wallet.query()
    .where('account_id', accountId)
    .where('id', walletId)
    .get();

  let balance = wallet[0].confirmedBalance;

  const txs = Tx.query()
    .where('account_id', accountId)
    .where('wallet_id', walletId)
    .get();

  txs.forEach((tx) => {
    if (tx.confirmations === 0) {
      balance -= (parseFloat(tx.fee) + parseFloat(tx.value));
    }
  });

  return balance;
}

function getBalance(wallet, accountId) {
  if (wallet.sdk === 'Bitcoin') {
    return {
      confirmed: getConfirmedBitcoin(wallet.id, accountId),
      unconfirmed: getUnconfrimedBitcoin(wallet.id, accountId),
      available: getAvailableBitcoin(wallet.id, accountId),
    };
  }

  if (wallet.sdk === 'Ethereum') {
    return {
      confirmed: getConfirmedEthereum(wallet.id, accountId),
      unconfirmed: getUnconfrimedEthereum(wallet.id, accountId),
      available: getAvailableEthereum(wallet.id, accountId),
    };
  }

  if (wallet.sdk === 'ERC20') {
    return {
      confirmed: 0,
      unconfirmed: 0,
      available: 0,
    };
  }

  return false;
}

export default getBalance;
