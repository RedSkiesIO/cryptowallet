<template>
  <div
    v-if="showContent"
    class="container"
  >
    <div>
      <h1 class="setup">
        {{ $t('completeSetup') }}
      </h1>
    </div>
    <div class="slide-wrapper">
      <div class="icon-wrapper">
        <q-icon
          name="wifi"
          size="10rem"
          color="white"
          class="temp-ill"
        />
      </div>
      <p>
        {{ $t('reconnectToInternet') }}
      </p>
    </div>
    <div class="btns-wrapper">
      <q-btn
        :disabled="!online"
        :label="$t('activateYourWallet')"
        color="primary"
        text-color="blueish"
        @click="complete"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { Network } from '@/helpers';
import Wallet from '@/store/wallet/entities/wallet';
import Address from '@/store/wallet/entities/address';
import Tx from '@/store/wallet/entities/tx';

export default {
  name: 'Complete',
  data() {
    return {
      online: null,
      account: null,
      showContent: false,
    };
  },
  computed: {
    ...mapState({
      authenticatedAccount: (state) => { return state.settings.authenticatedAccount; },
      setup: (state) => { return state.setup; },
      delay: (state) => { return state.settings.delay; },
    }),

    supportedCoins() {
      return this.$store.state.settings.supportedCoins;
    },
  },

  async mounted() {
    this.network = new Network(this.$q.platform.is);
    this.online = this.network.isOnline();

    this.network
      .on('offline', () => {
        this.online = false;
      })
      .on('online', () => {
        this.online = true;
      });
    if (!this.setup.accountCreated) {
      if (this.online) {
        await this.complete();
      } else {
        this.showContent = true;
      }
    }
  },

  methods: {
    async storeTransactions(txs, id) {
      if (txs.length > 0) {
        const transactions = txs.map((tx) => {
          tx.account_id = this.authenticatedAccount;
          tx.wallet_id = id;
          return tx;
        });
        transactions.sort((a, b) => {
          return this.createDate(b.confirmedTime) - this.createDate(a.confirmedTime);
        });
        await Tx.$insert({ data: transactions });
      }
    },

    async enableCatalyst(initializedWallet, wallet) {
      const coinSDK = this.coinSDKS[wallet.sdk];
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
      await this.storeTransactions(txHistory.txs, wallet.id);
    },
    /**
     * complete setup and store account entity.
     */
    async complete() {
      this.$store.dispatch('settings/setLoading', true);

      setTimeout(async () => {
        try {
          const account = await this.accountInitializer.createAccount(this.setup);
          this.$store.dispatch('settings/setSelectedAccount', this.setup.accountName);
          await this.accountInitializer.createWallets(this.setup, account.id, this.supportedCoins);
          await this.accountInitializer.createERC20Wallets(
            this.setup,
            account.id,
            this.supportedCoins,
          );
          this.$store.dispatch('setup/setAccountCreated');
          this.$store.dispatch('settings/setAuthenticatedAccount', account.id);

          const wallet = Wallet.query().where((wal) => {
            return wal.name === 'Catalyst' && wal.account_id === account.id;
          }).get()[0];

          const initializedWallet = wallet.hdWallet;

          if (!this.activeWallets[account.id]) {
            this.activeWallets[account.id] = {};
          }

          this.activeWallets[account.id][wallet.name] = initializedWallet;
          let success = true;
          try {
            await this.enableCatalyst(initializedWallet, wallet);
          } catch (err) {
            success = false;
          }
          Wallet.$update({
            where: (record) => { return record.id === wallet.id; },
            data: { imported: success, enabled: success },
          });

          // Object.getPrototypeOf(this.$root).backEndService =
          // new this.BackEndService
          // (this.$root, this.authenticatedAccount, this.setup.pinArray.join(''));
          // await this.backEndService.connect();
          // await this.backEndService.loadPriceFeed();

          this.$store.dispatch('setup/clearSetupData');
          this.$store.dispatch('settings/setLayout', 'light');
          this.$router.push({ path: '/wallet' });
        } catch (err) {
          this.errorHandler(err);
        }
        setTimeout(() => {
          this.$store.dispatch('settings/setLoading', false);
        }, this.delay.normal);
      }, this.delay.normal);
    },
  },
};
</script>
<style>

.icon-wrapper {
  text-align: center;
}
.slide-wrapper {
  width: 100%;
  height: calc(100% - 7rem);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 .5rem;
}
</style>
