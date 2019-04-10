<template>
  <div>
    <q-dialog
      v-model="addWalletModalOpened"
      persistent
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
      content-class="dark-modal"
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
          {{ $t('wallets') }}
        </h1>
        <div
          class="header-settings-button-wrapper"
        >
          <!-- <q-btn
            icon="add"
            color="secondary"
            size="lg"
            class="icon-btn icon-btn-right"
            flat
            @click.prevent="openAddWalletModal"
          /> -->
        </div>
      </div>

      <div class="modal-layout-wrapper no-padding">
        <WalletsList
          :wallets="supportedCoins"
          click-item-action="addWallet"
        />
      </div>
    </q-dialog>

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
      msToS: 1000,
    };
  },
  computed: {
    ...mapState({
      authenticatedAccount: (state) => { return state.settings.authenticatedAccount; },
      delay: (state) => { return state.settings.delay; },
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
    /*eslint-disable*/
    async enableBitcoin(coinSDK, initializedWallet, wallet) {


      const {
        txHistory,
        externalAccountDiscovery,
        internalAccountDiscovery,
        externalChainAddressIndex,
        internalChainAddressIndex,
        utxos,
      } = await this.discoverWallet(initializedWallet, coinSDK, wallet.network, wallet.sdk);


      const keyPair = coinSDK.generateKeyPair(initializedWallet, externalChainAddressIndex);

      Wallet.$update({
        where: (record) => { return record.id === wallet.id; },
        data: {
          externalChainAddressIndex,
          internalChainAddressIndex,
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
        if (tx.confirmed) { confirmedTx.push(tx); }
        if (!tx.confirmed) { unconfirmedTx.push(tx); }
      });

      utxos.forEach((utxo) => {
        utxo.account_id = this.authenticatedAccount;
        utxo.wallet_id = wallet.id;
        Utxo.$insert({ data: utxo });
      });

      const createDate = ((timestamp) => {
        return new Date(timestamp * this.msToS).getTime();
      });

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
        if (tx.confirmed) { confirmedTx.push(tx); }
        if (!tx.confirmed) { unconfirmedTx.push(tx); }
      });

      const createDate = ((timestamp) => {
        return new Date(timestamp * this.msToS).getTime();
      });

      const allTx = [...unconfirmedTx, ...confirmedTx];
      allTx.sort((a, b) => { return createDate(b.confirmedTime) - createDate(a.confirmedTime); });

      allTx.forEach(async (tx) => {
        await Tx.$insert({ data: tx });
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

      const response = await this.backEndService.getPriceFeed(
        [wallet.symbol],
        [this.selectedCurrency.code],
      );
      const prices = response.data[0];
      if (response) {
        this.backEndService.storePriceData(wallet.symbol, prices[this.selectedCurrency.code]);
      }

      const dayData = await this.backEndService.getHistoricalData(wallet.symbol, this.selectedCurrency.code, 'day');
      const weekData = await this.backEndService.getHistoricalData(wallet.symbol, this.selectedCurrency.code, 'week');
      const monthData = await this.backEndService.getHistoricalData(wallet.symbol, this.selectedCurrency.code, 'month');

      if (dayData && weekData && monthData) {
        this.storeChartData(wallet.symbol, 'day', dayData.data);
        this.storeChartData(wallet.symbol, 'week', weekData.data);
        this.storeChartData(wallet.symbol, 'month', monthData.data);
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
      const response = await this.backEndService.getPriceFeed(
        [wallet.symbol],
        [this.selectedCurrency.code],
      );
      const prices = response.data[0];
      if (response) {
        this.backEndService.storePriceData(wallet.symbol, prices[this.selectedCurrency.code]);
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
        if (tx.confirmed) { confirmedTx.push(tx); }
        if (!tx.confirmed) { unconfirmedTx.push(tx); }
      });

      const createDate = ((timestamp) => {
        return new Date(timestamp * this.msToS).getTime();
      });

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
              promises.push(() => {
                new Promise(async (resolve) => {
                await this.enableWallet(wallet);
                resolve();
               })
              });
            }
          });

          try {
            await Promise.all(promises.map((promise) => { promise(); }));
            await Promise.all(erc20Promises);
            this.loading = false;

            setTimeout(() => {
              this.addWalletModalOpened = false;
            }, this.delay.short);
          } catch (err) {
            this.errorHandler(err);
          }
        }, this.delay.normal);
      } else {
        this.addWalletModalOpened = false;
      }
    },
  },
};
</script>

<style>
.close-btn .q-btn__content {
  justify-content: flex-start;
}

.modal.app-loading {
  opacity: 0.8;
}
</style>
