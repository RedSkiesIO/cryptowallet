<template>
  <div
    class="wallet selectWallet"
    @click="clickHandler(wallet.id)"
  >
    <div class="details">
      <div class="icon"/>
      <div class="name">{{ wallet.name }}</div>
    </div>
    <div
      v-if="wallet.balance"
      class="balance"
    >
      <div>{{ wallet.balance }}</div>
      <Amount
        :amount="wallet.balance"
        :prepend-plus-or-minus="false"
        :currency="currency"
        :coin="wallet.key"
      />
    </div>
    <div>
      <div v-if="clickItemAction == 'selectWallet'">
        <q-icon name="chevron_right"/>
      </div>

      <div v-if="clickItemAction == 'addWallet'">
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
        <h1>Creating a wallet</h1>
        <q-spinner
          :size="50"
          color="primary"
        />
      </div>


    </q-modal>

  </div>
</template>

<script>
import { mapState } from 'vuex';
import Amount from '@/components/Wallet/Amount';
import Wallet from '@/store/wallet/entities/wallet';

export default {
  name: 'WalletItem',
  components: {
    Amount,
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
    };
  },
  computed: {
    ...mapState({
      authenticatedAccount: state => state.settings.authenticatedAccount,
    }),
    account() {
      return this.$store.getters['entities/account/find'](this.authenticatedAccount);
    },
    isEnabled: {
      get() {
        return this.isWalletEnabled(this.wallet.name);
      },
      set(val) {
        if (val) this.initializingModalOpened = true;
        if (!val) this.disableWallet();
      },
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
    isWalletEnabled() {
      const result = Wallet.query().where('account_id', this.authenticatedAccount).where('name', this.wallet.name).get();
      return result.length > 0;
    },

    /**
     * @todo Konrad
     * This method (and file) is being worked on on another branch, thats not finished,
     * please ignore.
     */
    enableWallet() {
      setTimeout(() => {
        const coin = this.CryptoWalletSDK.SDKFactory.CryptoWallet.createSDK(this.wallet.name);
        const wallet = coin.generateHDWallet(this.account.seed.join(' ').trim(), this.wallet.network);

        const data = {
          wallet,
          name: this.wallet.name,
          account_id: this.authenticatedAccount,
        };

        Wallet.$insert({ data })
          .then(() => {
            setTimeout(() => {
              this.initializingModalOpened = false;
            }, 250);
          });
      }, 250);
    },
    disableWallet() {
      const result = Wallet.query().where('account_id', this.authenticatedAccount).where('name', this.wallet.name).get();
      if (result[0]) Wallet.$delete(result[0].id);
    },
  },
};
</script>

<style scoped>
.selectWallet {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #13273a;
}

.selectWallet .details {
  display: flex;
  align-items: center;
}

.icon {
  border-radius:100%;
  background: #41678a;
  width: 2.5rem;
  height: 2.5rem;
  margin-right: 1rem;
}

.initialize-wallet-modal {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-around;
  font-size: 1.1em;
  line-height: 1;
}
</style>
