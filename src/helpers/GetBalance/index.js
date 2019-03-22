import Utxo from '@/store/wallet/entities/utxo';
import Tx from '@/store/wallet/entities/tx';
import Wallet from '@/store/wallet/entities/wallet';

const Bitcoin = {
  getConfirmed(walletId, accountId) {
    let balance = 0;

    const utxos = Utxo.query()
      .where('account_id', accountId)
      .where('wallet_id', walletId)
      .get();

    utxos.forEach((utxo) => {
      balance += utxo.amount;
    });

    return balance;
  },

  getUnconfrimed(walletId, accountId) {
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
  },

  getAvailable(walletId, accountId) {
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
  },
};

const Ethereum = {
  getConfirmed(walletId, accountId) {
    const wallet = Wallet.query()
      .where('account_id', accountId)
      .where('id', walletId)
      .get();

    return wallet[0].confirmedBalance;
  },

  getUnconfrimed(walletId, accountId) {
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
  },

  getAvailable(walletId, accountId) {
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
  },
};


function getBalance(wallet, accountId) {
  if (wallet.sdk === 'Bitcoin') {
    return {
      confirmed: Bitcoin.getConfirmed(wallet.id, accountId),
      unconfirmed: Bitcoin.getUnconfrimed(wallet.id, accountId),
      available: Bitcoin.getAvailable(wallet.id, accountId),
    };
  }

  if (wallet.sdk === 'Ethereum') {
    return {
      confirmed: Ethereum.getConfirmed(wallet.id, accountId),
      unconfirmed: Ethereum.getUnconfrimed(wallet.id, accountId),
      available: Ethereum.getAvailable(wallet.id, accountId),
    };
  }

  // @todo finish with ERC20
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
