<template>
  <div class="center-content-wrapper">
    <div v-if="account">
      <h1 class="account-name-h1 setup">{{ account.name }}</h1>
      <pin-pad mode="auth"/>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import PinPad from '@/components/Auth/PinPad';
import Wallet from '@/store/wallet/entities/wallet';

export default {

  components: {
    PinPad,
  },

  data() {
    return {
      pin: [],
    };
  },

  computed: {
    ...mapState({
      selectedAccount: state => state.settings.selectedAccount,
    }),

    accounts() {
      return this.$store.getters['entities/account/query']().get();
    },

    /**
     * Computes the currently selected account
     */
    account() {
      if (this.selectedAccount) {
        return this.accounts.find(account => account.name === this.selectedAccount);
      }

      return this.accounts.find(account => account.default);
    },
  },

  beforeMount() {
    this.pinInputListener();
  },

  /**
   * If there is no account seleted, selects te default one
   */
  mounted() {
    if (!this.selectedAccount) {
      const defaultAccount = this.accounts.find(account => account.default);
      if (defaultAccount) this.$store.dispatch('settings/setSelectedAccount', defaultAccount.name);
    }
  },

  methods: {
    resetPin() {
      this.pin = [];
    },
    /**
     * Adds or removes pin input event to pin arr.
     */
    pinInputListener() {
      this.$root.$on('inputPin', (pin) => {
        this.pin.push(pin);
      });
    },

    /**
     * Compares bcrypt pin string to try and unlock an account
     */
    attemptUnlock() {
      if (this.$CWCrypto.bcryptCompareString(this.pin.join(''), this.account.pinHash) === true) {
        this.$store.dispatch('settings/setAuthenticatedAccount', this.account.id);
        this.$i18n.locale = this.account.locale;

        this.initializeWallets(this.account.id)
          .then(() => {
            this.$router.push({ path: '/wallet' });
          });
      }
    },
    initializeWallets(accountId) {
      this.$store.dispatch('settings/setLoading', true);

      return new Promise((resolve) => {
        setTimeout(() => {
          const initializedWallets = {};
          this.activeWallets[accountId] = initializedWallets;

          const wallets = Wallet.query().where('account_id', accountId).get();
          if (wallets.length === 0) {
            this.$store.dispatch('settings/setLoading', false);
            this.$store.dispatch('settings/setLayout', 'light');
            resolve();
            return false;
          }

          function generate(wallet, vm, mnemonic) {
            initializedWallets[wallet.name] = vm.coinSDKS[wallet.sdk].generateHDWallet(
              mnemonic,
              wallet.network,
            );
          }

          wallets.forEach(wallet => generate(wallet, this, this.account.seed.join(' ').trim()));
          resolve();

          this.$nextTick(() => {
            this.$store.dispatch('settings/setLoading', false);
            this.$store.dispatch('settings/setLayout', 'light');
          });

          return false;
        }, 50);
      });
    },

    setAccountModalOpened(value) {
      this.selectAccountsModalOpened = value;
    },
  },
};

</script>

<style scoped>
.account-name-h1 {
  font-size: 2.5em;
  text-align: center;
  padding: 1.5rem;
  padding-top: 1rem;
}
</style>
