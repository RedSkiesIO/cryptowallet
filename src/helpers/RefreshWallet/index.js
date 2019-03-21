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

  const apiReturnLimit = 50;
  const txHistory = await coinSDK.getTransactionHistory(
    addressesRaw,
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
      const foundTx = result[0];
      if (foundTx.sent) {
        // update the tx
        Tx.$update({
          where: (record) => {
            return record.hash === tx.hash
            && record.wallet_id === wallet.id;
          },
          data: tx,
        });

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
      } else {
        // update found received
        Tx.$update({
          where: (record) => {
            return (
              record.hash === tx.hash
            && record.wallet_id === wallet.id
            );
          },
          data: tx,
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
        Wallet.$update({
          where: (record) => { return record.id === wallet.id; },
          data: {
            externalChainAddressIndex: wallet.externalChainAddressIndex + 1,
            externalAddress: null,
          },
        });
      }
    }
  });


  const utxos = await coinSDK.getUTXOs(
    addressesRaw,
    wallet.network,
  );

  utxos.forEach((utxo) => {
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

  return true;
}

async function refreshWallet(coinSDK, wallet, accountId) {
  if (wallet.sdk === 'Bitcoin') {
    await refreshBitcoin(coinSDK, wallet, accountId);
  }

  if (wallet.sdk === 'Ethereum') {
    console.log('REFRESH ETH');
  }

  return false;
}

export default refreshWallet;
