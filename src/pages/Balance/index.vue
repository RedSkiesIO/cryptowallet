<template>
  <!-- eslint-disable -->
  <div v-if="wallet">
    <Transactions :wallet="wallet"/>
  </div>
</template>

<script>
import Transactions from '@/components/Wallet/Transactions';
import Address from '@/store/wallet/entities/address';
import Wallet from '@/store/wallet/entities/wallet';
import Tx from '@/store/wallet/entities/tx';
import Utxo from '@/store/wallet/entities/utxo';
import { mapState } from 'vuex';

export default {
  name: 'Balance',
  components: {
    Transactions,
  },
  computed: {
    ...mapState({
      id: state => state.route.params.id,
      authenticatedAccount: state => state.settings.authenticatedAccount,
    }),
    wallet() {
      return this.$store.getters['entities/wallet/find'](this.id);
    },
  },
  mounted() {
    this.$root.$on('updateWalletSingle', (done) => {
      console.log('update me', this.wallet.name);
      this.refresher(done);
    });
  },
  methods: {
    /**
     * Fetches and updates the UTXOs
     */
    async getUtxos(combinedAddresses) {
      const coinSDK = this.coinSDKS[this.wallet.sdk];
      const utxos = await coinSDK.getUTXOs(combinedAddresses, this.wallet.network);

      let balance = 0;
      utxos.forEach((utxo) => {
        balance += utxo.amount;
        const found = Utxo.query()
          .where('txid', utxo.txid)
          .where('vout', utxo.vout)
          .where('wallet_id', this.wallet.id)
          .get();

        if (!found[0]) {
          utxo.account_id = this.authenticatedAccount;
          utxo.wallet_id = this.wallet.id;
          Utxo.$insert({ data: utxo });
        }
      });

      return {
        utxos,
        balance,
      };
    },

    /**
     * Performs a wallet update
     */
    async refresher(done) {
      const coinSDK = this.coinSDKS[this.wallet.sdk];

      const addresses = Address.query()
        .where('account_id', this.authenticatedAccount)
        .where('wallet_id', this.wallet.id)
        .where('used', false)
        .get();

      let addressesRaw = addresses.map(item => item.address);

      function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
      }

      addressesRaw = addressesRaw.filter(onlyUnique);

      let newBalance;
      if (this.wallet.sdk === 'Bitcoin') {
        const result = await this.getUtxos(addressesRaw);
        const { balance } = result;
        newBalance = balance;
      } else if (this.wallet.sdk === 'Ethereum') {
        newBalance = await coinSDK.getBalance(addressesRaw, this.wallet.network);
      } else if (this.wallet.sdk === 'ERC20') {
        // eslint-disable-next-line max-len
        newBalance = await coinSDK.getBalance(this.activeWallets[this.authenticatedAccount][this.wallet.name]);
      }

      const { network } = this.wallet;
      let txHistory;
      if (this.wallet.sdk === 'ERC20') {
        // eslint-disable-next-line max-len
        txHistory = await coinSDK.getTransactionHistory(this.activeWallets[this.authenticatedAccount][this.wallet.name], 0);
      } else {
        txHistory = await coinSDK.getTransactionHistory(addressesRaw, network, 0, 50);
      }


      if (!txHistory) {
        done();
        return false;
      }

      if (this.wallet.sdk === 'ERC20') {
        txHistory.forEach((tx) => {
          const result = Tx.query()
            .where('hash', tx.hash)
            .where('wallet_id', this.wallet.id)
            .get();

          if (result[0]) {
            const foundTx = result[0];
            if (foundTx.sent) {
            // update the tx
              Tx.$update({
                where: record => record.hash === tx.hash && record.wallet_id === this.wallet.id,
                data: tx,
              });
            } else { // update found received
              Tx.$update({
                where: record => record.hash === tx.hash && record.wallet_id === this.wallet.id,
                data: tx,
              });
            }
          } else {
          // insert tx
            Tx.$insert({
              data: {
                account_id: this.authenticatedAccount,
                wallet_id: this.wallet.id,
                ...tx,
              },
            });
          }
        });
      } else {
        txHistory.txs.forEach((tx) => {
          const result = Tx.query()
            .where('hash', tx.hash)
            .where('wallet_id', this.wallet.id)
            .get();

          if (result[0]) {
            const foundTx = result[0];
            if (foundTx.sent) {
            // update the tx
              Tx.$update({
                where: record => record.hash === tx.hash && record.wallet_id === this.wallet.id,
                data: tx,
              });

              if (this.wallet.sdk === 'Bitcoin') {
              // delete utxo that were used for that transaction
                tx.sender.forEach((inputAddress) => {
                  const pendingUtxo = Utxo.query().where('address', inputAddress).where('pending', true).get();
                  pendingUtxo.forEach((pending) => {
                    Utxo.$delete(pending.id);
                  });
                });

                // find change address that were used and mark them as used
                tx.receiver.forEach((changeAddress) => {
                  Address.$update({
                    where: record => record.chain === 'internal' && record.address === changeAddress,
                    data: { used: true },
                  });
                });
              }
            } else { // update found received
              Tx.$update({
                where: record => record.hash === tx.hash && record.wallet_id === this.wallet.id,
                data: tx,
              });
            }
          } else {
          // insert tx
            Tx.$insert({
              data: {
                account_id: this.authenticatedAccount,
                wallet_id: this.wallet.id,
                ...tx,
              },
            });
            // update external address
            if (this.wallet.sdk === 'Bitcoin') {
              if (tx.receiver.includes(this.wallet.externalAddress)) {
                Wallet.$update({
                  where: record => record.id === this.wallet.id,
                  data: {
                    externalChainAddressIndex: this.wallet.externalChainAddressIndex + 1,
                    externalAddress: null,
                  },
                });
              }
            }
          }
        });
      }

      // update balance
      Wallet.$update({
        where: record => record.id === this.wallet.id,
        data: { confirmedBalance: parseFloat(newBalance, 10) },
      });

      setTimeout(() => {
        done();
      }, 500);

      return false;
    },
  },
};

</script>

<style scoped>

</style>
