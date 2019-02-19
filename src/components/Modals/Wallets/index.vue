<template>
  <div>
    <q-modal
      v-model="addWalletModalOpened"
      class="dark-modal"
    >
      <div class="header-section">
        <div class="header-back-button-wrapper">
          <q-btn
            icon="arrow_back"
            size="lg"
            class="icon-btn back-arrow-btn"
            flat
            @click.prevent="close"
          />
        </div>
        <h1 class="header-h1">
          Wallets
        </h1>
        <div
          class="header-settings-button-wrapper"
        >
          <q-btn
            icon="add"
            color="secondary"
            size="lg"
            class="icon-btn icon-btn-right"
            flat
            @click.prevent="openAddWalletModal"
          />
        </div>
      </div>

      <div class="modal-layout-wrapper no-padding">
        <WalletsList
          :wallets="supportedCoins"
          click-item-action="addWallet"
        />
      </div>
    </q-modal>

    <div
      v-if="loading"
      class="app-loading background modal"
    >
      <Spinner />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import WalletsList from '@/components/Wallet/WalletsList';
import Wallet from '@/store/wallet/entities/wallet';
import Address from '@/store/wallet/entities/address';
import Tx from '@/store/wallet/entities/tx';
import Utxo from '@/store/wallet/entities/utxo';
import Spinner from '@/components/Spinner';
import Coin from '@/store/wallet/entities/coin';
import Latest from '@/store/latestPrice';
import Prices from '@/store/prices';

export default {
  name: 'AddWallet',
  components: {
    WalletsList,
    Spinner,
  },
  data() {
    return {
      addWalletModalOpened: false,
      loading: false,
    };
  },
  computed: {
    ...mapState({
      authenticatedAccount: (state) => { return state.settings.authenticatedAccount; },
    }),
    selectedCurrency() {
      return this.$store.state.settings.selectedCurrency;
    },
    supportedCoins() {
      return Coin.all();
    },
    account() {
      return this.$store.getters['entities/account/find'](this.authenticatedAccount);
    },
  },
  mounted() {
    this.$root.$on('walletsModalOpened', (value) => {
      this.addWalletModalOpened = value;
    });
  },
  methods: {
    openAddWalletModal() {
      this.$root.$emit('erc20ModalOpened', true);
    },
    async enableBitcoin(coinSDK, initializedWallet, wallet) {
      const {
        txHistory,
        externalAccountDiscovery,
        internalAccountDiscovery,
        externalChainAddressIndex,
        internalChainAddressIndex,
        balance,
        utxos,
      } = await this.discoverWallet(initializedWallet, coinSDK, wallet.network, wallet.sdk);

      const keyPair = coinSDK.generateKeyPair(initializedWallet, externalChainAddressIndex);

      Wallet.$update({
        where: (record) => { return record.id === wallet.id; },
        data: {
          externalChainAddressIndex,
          internalChainAddressIndex,
          confirmedBalance: balance,
          externalAddress: keyPair.address,
        },
      });

      const newAddress = {
        account_id: this.authenticatedAccount,
        wallet_id: wallet.id,
        chain: 'external',
        address: keyPair.address,
        index: externalChainAddressIndex,
      };

      await Address.$insert({ data: newAddress });

      const unconfirmedTx = [];
      const confirmedTx = [];

      txHistory.txs.forEach((tx) => {
        tx.account_id = this.authenticatedAccount;
        tx.wallet_id = wallet.id;
        if (tx.confirmed) confirmedTx.push(tx);
        if (!tx.confirmed) unconfirmedTx.push(tx);
      });

      utxos.forEach((utxo) => {
        utxo.account_id = this.authenticatedAccount;
        utxo.wallet_id = wallet.id;
        Utxo.$insert({ data: utxo });
      });

      function createDate(timestamp) {
        return new Date(timestamp * 1000).getTime();
      }

      const allTx = [...unconfirmedTx, ...confirmedTx];
      allTx.sort((a, b) => { return createDate(b.receivedTime) - createDate(a.receivedTime); });

      allTx.forEach(async (tx) => {
        await Tx.$insert({ data: tx });
      });

      externalAccountDiscovery.active.forEach(async (address) => {
        address.account_id = this.authenticatedAccount;
        address.wallet_id = wallet.id;
        address.chain = 'external';
        address.hash = address.address;
        address.index = address.index;
        await Address.$insert({ data: address });
      });

      internalAccountDiscovery.used.forEach(async (address) => {
        address.account_id = this.authenticatedAccount;
        address.wallet_id = wallet.id;
        address.chain = 'internal';
        address.hash = address.address;
        address.index = address.index;
        await Address.$insert({ data: address });
      });
    },

    async enableEthereum(coinSDK, initializedWallet, wallet) {
      const {
        txHistory,
        accounts,
        balance,
      } = await this.discoverWallet(initializedWallet, coinSDK, wallet.network, wallet.sdk);

      Wallet.$update({
        where: (record) => { return record.id === wallet.id; },
        data: {
          externalChainAddressIndex: 0,
          internalChainAddressIndex: 0,
          confirmedBalance: balance,
          externalAddress: accounts[0].address,
        },
      });

      const newAddress = {
        account_id: this.authenticatedAccount,
        wallet_id: wallet.id,
        chain: 'external',
        address: accounts[0].address,
        index: 0,
      };

      await Address.$insert({ data: newAddress });

      const unconfirmedTx = [];
      const confirmedTx = [];

      txHistory.txs.forEach((tx) => {
        tx.account_id = this.authenticatedAccount;
        tx.wallet_id = wallet.id;
        if (tx.confirmed) confirmedTx.push(tx);
        if (!tx.confirmed) unconfirmedTx.push(tx);
      });

      function createDate(timestamp) {
        return new Date(timestamp * 1000).getTime();
      }

      const allTx = [...unconfirmedTx, ...confirmedTx];
      allTx.sort((a, b) => { return createDate(b.confirmedTime) - createDate(a.confirmedTime); });

      allTx.forEach(async (tx) => {
        await Tx.$insert({ data: tx });
      });
    },

    storePriceData(coin, latestPrice) {
      return new Promise(async (resolve) => {
        const checkPriceExists = (symbol, data) => {
          const price = Latest.find([`${symbol}_${this.selectedCurrency.code}`]);
          if (!price) {
            Latest.$insert({
              data: {
                coin,
                currency: this.selectedCurrency.code,
                updated: +new Date(),
                data,
              },
            });
            return false;
          }
          return true;
        };
        const whereLatestPrice = (record, item) => {
          return (
            record.coin === item.coin
           && record.currency === item.currency
          );
        };

        if (checkPriceExists(coin, latestPrice)) {
          Latest.$update({
            where: (record) => {
              return whereLatestPrice(record, {
                coin,
                currency: this.selectedCurrency.code,
              });
            },
            data: {
              updated: +new Date(),
              data: latestPrice,
            },
          });
        }
        resolve();
      });
    },

    storeChartData(coin, period, latestPrice) {
      return new Promise(async (resolve) => {
        const checkPriceExists = (symbol, data) => {
          const price = Prices.find([`${symbol}_${this.selectedCurrency.code}_${period}`]);
          if (!price) {
            Prices.$insert({
              data: {
                coin,
                currency: this.selectedCurrency.code,
                period,
                updated: +new Date(),
                data,
              },
            });
            return false;
          }
          return true;
        };
        const whereLatestPrice = (record, item) => {
          return (
            record.coin === item.coin
            && record.currency === item.currency
            && record.period === item.period
          );
        };

        if (checkPriceExists(coin, latestPrice)) {
          Prices.$update({
            where: (record) => {
              return whereLatestPrice(record, {
                coin,
                currency: this.selectedCurrency.code,
                period,
              });
            },
            data: {
              updated: +new Date(),
              data: latestPrice,
            },
          });
        }
        resolve();
      });
    },

    async enableWallet(wallet) {
      const coinSDK = this.coinSDKS[wallet.sdk];
      const prices = await coinSDK.getPriceFeed([wallet.symbol], [this.selectedCurrency.code]);
      if (prices) {
        this.storePriceData(wallet.symbol, prices[wallet.symbol][this.selectedCurrency.code]);
      }
      const dayData = await coinSDK.getHistoricalData(wallet.symbol, this.selectedCurrency.code, 'day');
      const weekData = await coinSDK.getHistoricalData(wallet.symbol, this.selectedCurrency.code, 'week');
      const monthData = await coinSDK.getHistoricalData(wallet.symbol, this.selectedCurrency.code, 'month');

      if (dayData && weekData && monthData) {
        this.storeChartData(wallet.symbol, 'day', dayData);
        this.storeChartData(wallet.symbol, 'week', weekData);
        this.storeChartData(wallet.symbol, 'month', monthData);
      }
      const initializedWallet = wallet.hdWallet;

      if (!this.activeWallets[this.authenticatedAccount]) {
        this.activeWallets[this.authenticatedAccount] = {};
      }

      this.activeWallets[this.authenticatedAccount][wallet.name] = initializedWallet;

      try {
        if (wallet.sdk === 'Bitcoin') {
          await this.enableBitcoin(coinSDK, initializedWallet, wallet);
        }
        if (wallet.sdk === 'Ethereum') {
          await this.enableEthereum(coinSDK, initializedWallet, wallet);
        }
      } catch (err) {
        this.errorHandler(err);
      }

      Wallet.$update({
        where: (record) => { return record.id === wallet.id; },
        data: { imported: true, enabled: true },
      });
    },

    async enableErc20Wallet(wallet) {
      const coinSDK = this.coinSDKS[wallet.sdk];
      const parentSDK = this.coinSDKS[wallet.parentSdk];
      const prices = await parentSDK.getPriceFeed([wallet.symbol], [this.selectedCurrency.code]);

      if (prices) {
        this.storePriceData(wallet.symbol, prices[wallet.symbol][this.selectedCurrency.code]);
      }
      if (!wallet.erc20Wallet) {
        const parentWallet = this.activeWallets[this.authenticatedAccount][wallet.parentName];
        const keyPair = await parentSDK.generateKeyPair(parentWallet, 0);
        wallet.erc20Wallet = await coinSDK.generateERC20Wallet(
          keyPair,
          wallet.name,
          wallet.symbol,
          wallet.contractAddress,
          wallet.decimals,
        );
      }

      this.activeWallets[this.authenticatedAccount][wallet.name] = wallet.erc20Wallet;

      const {
        txHistory,
        balance,
      } = await this.discoverWallet(wallet.erc20Wallet, coinSDK, wallet.network, wallet.sdk);

      Wallet.$update({
        where: (record) => { return record.id === wallet.id; },
        data: {
          externalChainAddressIndex: 0,
          internalChainAddressIndex: 0,
          confirmedBalance: balance,
          externalAddress: wallet.erc20Wallet.address,
        },
      });

      const newAddress = {
        account_id: this.authenticatedAccount,
        wallet_id: wallet.id,
        chain: 'external',
        address: wallet.erc20Wallet.address,
        index: 0,
      };

      await Address.$insert({ data: newAddress });

      const unconfirmedTx = [];
      const confirmedTx = [];

      txHistory.forEach((tx) => {
        tx.account_id = this.authenticatedAccount;
        tx.wallet_id = wallet.id;
        if (tx.confirmed) confirmedTx.push(tx);
        if (!tx.confirmed) unconfirmedTx.push(tx);
      });

      function createDate(timestamp) {
        return new Date(timestamp * 1000).getTime();
      }

      const allTx = [...unconfirmedTx, ...confirmedTx];
      allTx.sort((a, b) => { return createDate(b.confirmedTime) - createDate(a.confirmedTime); });

      allTx.forEach(async (tx) => {
        await Tx.$insert({ data: tx });
      });

      Wallet.$update({
        where: (record) => { return record.id === wallet.id; },
        data: { imported: true, enabled: true },
      });
    },

    addWallet() {
      this.addWalletModalOpened = true;
    },
    close() {
      const wallets = Wallet.query()
        .where('account_id', this.authenticatedAccount)
        .where('enabled', true)
        .where('imported', false)
        .get();

      if (wallets.length > 0) {
        this.loading = true;

        const promises = [];
        const erc20Promises = [];

        setTimeout(async () => {
          wallets.forEach((wallet) => {
            if (wallet.sdk === 'ERC20') {
              erc20Promises.push(new Promise(async (resolve) => {
                await this.enableErc20Wallet(wallet);
                resolve();
              }));
            } else {
              promises.push(new Promise(async (resolve) => {
                await this.enableWallet(wallet);
                resolve();
              }));
            }
          });

          try {
            await Promise.all(promises);
            await Promise.all(erc20Promises);
            this.loading = false;

            setTimeout(() => {
              this.addWalletModalOpened = false;
            }, 250);
          } catch (err) {
            this.errorHandler(err);
          }
        }, 500);
      } else {
        this.addWalletModalOpened = false;
      }
    },
  },
};
</script>

<style>
.close-btn .q-btn-inner {
  justify-content: flex-start;
}

.modal.app-loading {
  opacity: 0.8;
}
</style>
