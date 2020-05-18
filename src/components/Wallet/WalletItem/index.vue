<template>
  <div>
    <div class="account-item">
      <q-slide-item
        class="wallet selectWallet"
        right-color="red"
        @right="onRight"
      >
        <template v-slot:right>
          <div
            class="delete-cancel"
          >
            <q-icon
              name="close"
              @click="reset"
            />
          </div>
        </template>

        <template
          v-if="!isEnabled && wallet.imported"
          v-slot:right
        >
          <q-icon
            name="close"
            class="delete-cancel"
            @click="cancelDelete"
          />
          <q-icon
            name="delete"
            @click="confirmDelete"
          />
        </template>

        <q-item dark>
          <q-item-section avatar>
            <div class="icon">
              <img :src="coinLogo">
            </div>
          </q-item-section>
          <q-item-section>
            {{ wallet.displayName }}
          </q-item-section>
          <q-item-section
            side
          >
            <q-toggle
              v-model="isEnabled"
            />
          </q-item-section>
        </q-item>
      </q-slide-item>
    </div>
    <q-dialog
      v-model="confirm"
      persistent
    >
      <q-card
        style="width: 300px"
        class="dialog"
      >
        <q-card-section>
          <h2>{{ $t('confirm') }}</h2>
          <p>
            {{ $t('deleteTokenConfirm') }}
          </p>
          <p>
            {{ $t('deleteToken1') }} {{ wallet.name }} {{ $t('deleteToken2') }}
          </p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            v-close-popup
            flat
            :label="$t('cancelConfirm')"
            color="blueish"
          />
          <q-btn
            flat
            :label="$t('acceptConfirm')"
            color="blueish"
            @click="deleteWallet"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Wallet from '@/store/wallet/entities/wallet';
import Address from '@/store/wallet/entities/address';
import Tx from '@/store/wallet/entities/tx';
import Utxo from '@/store/wallet/entities/utxo';
import Coin from '@/store/wallet/entities/coin';
import IconList from '@/statics/cc-icons/icons-list.json';

export default {
  name: 'WalletItem',

  components: {
  },

  props: {
    wallet: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      reset: null,
      initializingModalOpened: false,
      walletsState: [],
      confirm: false,
    };
  },

  computed: {
    ...mapState({
      authenticatedAccount: (state) => { return state.settings.authenticatedAccount; },
    }),
    isEnabled: {
      get() {
        return this.isWalletEnabled();
      },
      set(val) {
        if (val) {
          this.enableWallet();
        }
        if (!val) {
          this.disableWallet();
        }
      },
    },
    supportedCoins() {
      return Coin.all();
    },
    coin() {
      return Coin.find([this.wallet.name]);
    },
    coinLogo() {
      const coinIcon = IconList.find((icon) => {
        return icon.symbol === this.wallet.symbol.toUpperCase();
      });
      if (coinIcon) {
        const fileType = coinIcon.png ? '.png' : '.svg';
        return `./statics/cc-icons/color/${this.wallet.symbol.toLowerCase()}${fileType}`;
      }
      return './statics/cc-icons/color/generic.svg';
    },
  },

  methods: {
    onRight({ reset }) {
      this.reset = reset;
    },

    cancelDelete() {
      if (this.reset) {
        this.reset();
      }
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

        if (wallets.length > 0) {
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

            const parentSDK = this.coinSDKS[eth.sdk](this.wallet.network);
            const { parentName } = this.wallet;
            const parentWallet = this.activeWallets[this.authenticatedAccount][parentName];
            const keyPair = parentSDK.generateKeyPair(parentWallet, 0);

            const erc20 = await this.coinSDKS[this.wallet.sdk](this.wallet.network)
              .generateERC20Wallet(
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

    confirmDelete() {
      this.confirm = true;
      this.cancelDelete();
    },

    deleteWallet() {
      const wallets = Wallet.query().where('name', this.wallet.name).get();
      wallets.forEach((wallet) => {
        Wallet.$delete(wallet.id);

        const transactions = Tx.query().where('wallet_id', wallet.id).get();
        transactions.forEach((tx) => {
          Tx.$delete(tx.id);
        });
        const utxos = Utxo.query().where('wallet_id', wallet.id).get();
        utxos.forEach((tx) => {
          Utxo.$delete(tx.id);
        });

        const addresses = Address.query().where('wallet_id', wallet.id).get();
        addresses.forEach((address) => {
          Address.$delete(address.id);
        });
      });
      Coin.$delete(this.wallet.name);
      this.confirm = false;
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
.delete-cancel {
  margin-right: 10px;
}
</style>
