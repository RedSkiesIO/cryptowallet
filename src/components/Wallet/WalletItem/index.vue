<template>
  <div class="account-item">
    <div
      class="wallet selectWallet"
      @click="clickHandler(wallet.id)"
    >
      <div class="details">
        <div class="icon">
          <img :src="coinLogo">
        </div>
        <div class="name">
          {{ wallet.displayName }}
        </div>
      </div>
      <div>
        <div v-if="clickItemAction === 'addWallet'">
          <q-toggle
            v-model="isEnabled"
          />
        </div>
      </div>

      <q-modal
        v-model="initializingModalOpened"
        minimized
        @show="enableWallet()"
      >
        <div class="initialize-wallet-modal">
          <Spinner />
          <span>Enabling wallet</span>
        </div>
      </q-modal>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Wallet from '@/store/wallet/entities/wallet';
import Address from '@/store/wallet/entities/address';
import Tx from '@/store/wallet/entities/tx';
import Utxo from '@/store/wallet/entities/utxo';
import Spinner from '@/components/Spinner';
import Coin from '@/store/wallet/entities/coin';
import IconList from '@/assets/cc-icons/icons-list.json';

export default {
  name: 'WalletItem',

  components: {
    Spinner,
  },

  props: {
    wallet: {
      type: Object,
      required: true,
    },

    currency: {
      type: Object,
      required: false,
    },

    clickItemAction: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      initializingModalOpened: false,
      walletsState: [],
    };
  },

  computed: {
    ...mapState({
      authenticatedAccount: (state) => { return state.settings.authenticatedAccount; },
    }),

    account() {
      return this.$store.getters['entities/account/find'](this.authenticatedAccount);
    },
    isEnabled: {

      get() {
        return this.isWalletEnabled();
      },

      set(val) {
        if (val) {
          this.enableWallet();
        }
        if (!val) this.disableWallet();
      },
    },

    supportedCoins() {
      return Coin.all();
    },

    coinLogo() {
      if (IconList.find((icon) => { return icon.symbol === this.wallet.symbol.toUpperCase(); })) {
        return `./statics/cc-icons/color/${this.wallet.symbol.toLowerCase()}.svg`;
      }
      return './statics/cc-icons/color/generic.svg';
    },
  },

  methods: {
    clickHandler(id) {
      switch (this.clickItemAction) {
        case 'selectWallet':
          this.$router.push({ path: `/wallet/balance/${id}` });
          break;
        case 'addWallet':
          break;
        default:
          return false;
      }
      return false;
    },

    isWalletEnabled(id) {
      const result = Wallet.query(id)
        .where('account_id', this.authenticatedAccount)
        .where('displayName', this.wallet.displayName)
        .where('name', this.wallet.name)
        .where('enabled', true)
        .get();
      return result.length > 0;
    },

    isEthEnabled(network) {
      const result = Wallet.query(network)
        .where('account_id', this.authenticatedAccount)
        .where('name', network)
        .where('enabled', true)
        .get();
      return result.length > 0;
    },

    async enableWallet() {
      try {
        if (this.wallet.sdk === 'ERC20' && !this.isEthEnabled(this.wallet.parentName)) {
          const wallets = Wallet.query()
            .where('account_id', this.authenticatedAccount)
            .where('name', this.wallet.parentName)
            .get();

          await Wallet.$update({
            where: (record) => { return record.id === wallets[0].id; },
            data: { imported: false, enabled: true },
          });
        }

        const wallets = Wallet.query()
          .where('account_id', this.authenticatedAccount)
          .where('name', this.wallet.name)
          .get();

        if (wallets) {
          await Wallet.$update({
            where: (record) => { return record.id === wallets[0].id; },
            data: { imported: false, enabled: true },
          });
        } else {
          const data = {
            name: this.wallet.name,
            displayName: this.wallet.displayName,
            sdk: this.wallet.sdk,
            account_id: this.authenticatedAccount,
            network: this.wallet.network,
            symbol: this.wallet.symbol,
          };

          const newWalletResult = await Wallet.$insert({ data });
          const newWalletId = newWalletResult.wallet[0].id;

          await Wallet.$update({
            where: (record) => { return record.id === newWalletId; },
            data: { imported: false, enabled: true },
          });

          if (this.wallet.sdk === 'ERC20') {
            const eth = this.supportedCoins.find((coin) => {
              return coin.name === this.wallet.parentName;
            });

            const parentSDK = this.coinSDKS[eth.sdk];
            const { parentName } = this.wallet;
            const parentWallet = this.activeWallets[this.authenticatedAccount][parentName];
            const keyPair = parentSDK.generateKeyPair(parentWallet, 0);

            const erc20 = await this.coinSDKS[this.wallet.sdk].generateERC20Wallet(
              keyPair,
              this.walletName,
              this.wallet.symbol,
              this.wallet.contractAddress,
              this.wallet.decimals,
            );

            await Wallet.$update({
              where: (record) => { return record.id === newWalletId; },
              data: {
                parentSdk: eth.sdk,
                parentName: eth.name,
                contractAddress: this.wallet.contractAddress,
                decimals: this.wallet.decimals,
                erc20Wallet: erc20,
              },
            });
          }
        }
      } catch (err) {
        this.errorHandler(err);
      }
    },

    disableWallet() {
      const walletIds = [];
      if (this.wallet.sdk === 'Ethereum') {
        const erc20Wallets = Wallet.query()
          .where('account_id', this.authenticatedAccount)
          .where('sdk', 'ERC20')
          .get();

        erc20Wallets.forEach((wallet) => {
          walletIds.push(wallet.id);
        });
      }
      const wallets = Wallet.query()
        .where('account_id', this.authenticatedAccount)
        .where('displayName', this.wallet.displayName)
        .where('name', this.wallet.name)
        .get();

      walletIds.push(wallets[0].id);

      walletIds.forEach((walletId) => {
        Wallet.$update({
          where: (record) => { return record.id === walletId; },
          data: { imported: false, enabled: false },
        });

        const transactions = Tx.query().where('wallet_id', walletId).get();
        transactions.forEach((tx) => {
          Tx.$delete(tx.id);
        });

        const utxos = Utxo.query().where('wallet_id', walletId).get();
        utxos.forEach((tx) => {
          Utxo.$delete(tx.id);
        });

        const addresses = Address.query().where('wallet_id', walletId).get();
        addresses.forEach((address) => {
          Address.$delete(address.id);
        });
      });
    },
  },
};
</script>

<style scoped>
.selectWallet {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.selectWallet .details {
  display: flex;
  align-items: center;
}

.icon {
  border-radius:100%;
  width: 2.5rem;
  height: 2.5rem;
  margin-right: 1rem;
}

.icon img {
  width: 100%;
  height: 100%;
}

.initialize-wallet-modal {
  padding: 1em 1em;
  display: flex;
  align-items: center;
  justify-content: space-around;
  font-size: 1em;
}
</style>
