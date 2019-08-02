// eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from 'worker-loader!@/workers/RefreshWallet/worker';
import * as Comlink from 'comlink';
import Wallet from '@/store/wallet/entities/wallet';
import Tx from '@/store/wallet/entities/tx';
import Address from '@/store/wallet/entities/address';
import Utxo from '@/store/wallet/entities/utxo';


class RefreshWalletWorker {
  constructor() {
    this.worker = new Worker();
    this.instance = Comlink.wrap(this.worker);
  }

  async refreshWallet(wallet, fullRefresh = true) {
    function getAddresses(walletId) {
      return Address.query()
        .where('wallet_id', walletId)
        .get()
        .map((item) => { return item.address; });
    }

    function insertAddress(newAddress) {
      Address.$insert({ data: newAddress });
    }

    function getUtxos(walletId) {
      return Utxo.query()
        .where('wallet_id', walletId)
        .get()
        .map((utxo) => { return utxo.txid; });
    }

    function insertUtxos(utxos) {
      Utxo.$insert({ data: utxos });
    }

    function deleteUtxo(id) {
      const utxo = Utxo.query()
        .where('txid', id)
        .get();
      Utxo.$delete(utxo[0].id);
    }

    function updateTxs(txs, walletId) {
      txs.forEach((tx) => {
        Tx.$update({
          where: (record) => {
            return record.hash === tx.hash
            && record.wallet_id === walletId;
          },
          data: tx,
        });
      });
    }

    function insertTxs(txs) {
      Tx.$insert({
        data: txs,
      });
    }

    function getTxs(walletId) {
      return Tx.query().where('wallet_id', walletId).get().map((tx) => {
        return tx.hash;
      });
    }

    function updateWallet(walletId, option) {
      if (option.newBalance) {
        Wallet.$update({
          where: (record) => { return record.id === walletId; },
          data: { confirmedBalance: parseFloat(option.newBalance) },
        });
      }
      if (option.addr) {
        Wallet.$update({
          where: (record) => { return record.id === walletId; },
          data: {
            externalChainAddressIndex: option.addr.index,
            externalAddress: option.addr.address,
          },
        });
      }
    }

    const func = {
      updateWallet,
      updateTxs,
      insertTxs,
      getTxs,
      getAddresses,
      insertAddress,
      getUtxos,
      insertUtxos,
      deleteUtxo,
    };

    const refresh = await this.instance(wallet, Comlink.proxy(func), fullRefresh);
    return refresh;
  }
}

export default RefreshWalletWorker;
