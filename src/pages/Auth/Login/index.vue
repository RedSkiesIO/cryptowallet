<template>
  <div class="center-content-wrapper">
    <div v-if="account">
      <h1 class="account-name-h1 setup">
        {{ account.name }}
      </h1>
      <PinPad mode="auth" />
    </div>
  </div>
</template>

<script>
import { debounce } from 'quasar';
import AES from 'crypto-js/aes';
import encUTF8 from 'crypto-js/enc-utf8';
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
      selectedAccount: (state) => { return state.settings.selectedAccount; },
    }),

    accounts() {
      return this.$store.getters['entities/account/query']().get();
    },

    /**
     * Computes the currently selected account
     */
    account() {
      if (this.selectedAccount) {
        return this.accounts.find((account) => { return account.name === this.selectedAccount; });
      }

      return this.accounts.find((account) => { return account.default; });
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
      const defaultAccount = this.accounts.find((account) => { return account.default; });
      if (defaultAccount) { this.$store.dispatch('settings/setSelectedAccount', defaultAccount.name); }
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
    async attemptUnlock() {
      const minPinLength = 6;
      if (this.pin.length < minPinLength) { return false; }

      try {
        if (this.$CWCrypto.bcryptCompareString(this.pin.join(''), this.account.pinHash) === true) {
          this.$store.dispatch('settings/setLoading', true);
          this.$store.dispatch('settings/setAuthenticatedAccount', this.account.id);
          this.$i18n.locale = this.account.locale;
          await this.decryptData(this.account.id, this.pin.join(''));
          await this.initializeWallets(this.account.id);
          this.$router.push({ path: '/wallet' });
          this.$store.dispatch('settings/setLayout', 'light');

          setTimeout(() => {
            this.$store.dispatch('settings/setLoading', false);
          }, 1000);
        }
      } catch (err) {
        this.errorHandler(err);
      }

      return false;
    },

    debouncedUnlock: debounce(function callback() {
      this.attemptUnlock();
    }, 500),

    /**
     * Decrypts and returns a piece of data
     * @param  {Uint8Array} data
     * @param  {String} password
     * @return {Any}
     */
    decrypt(data, password) {
      const bytes = AES.decrypt(data, password);
      return JSON.parse(bytes.toString(encUTF8));
    },

    async decryptData(id, pass) {
      this.encryptedModels.forEach((model) => {
        if (model.name === 'Account') {
          const result = model.query().where('id', id).get();
          result.forEach((item) => {
            model.AES.forEach((key) => {
              item[key] = this.decrypt(item[key], pass);
            });
          });
        }
        if (model.name === 'Wallet') {
          const result = model.query().where('account_id', id).get();
          result.forEach((item) => {
            model.AES.forEach((key) => {
              if (item[key]) {
                item[key] = this.decrypt(item[key], pass);
              }
            });
          });
        }
      });
    },

    initializeWallets(accountId) {
      return new Promise((resolve) => {
        setTimeout(async () => {
          const initializedWallets = {};
          this.activeWallets[accountId] = initializedWallets;

          const wallets = Wallet.query()
            .where('account_id', accountId)
            .where('enabled', true)
            .get();
          if (wallets.length === 0) {
            resolve();
            return false;
          }

          async function generate(wallet) {
            initializedWallets[wallet.name] = wallet.hdWallet;
          }
          async function generateErc20(wallet) {
            initializedWallets[wallet.name] = wallet.erc20Wallet;
          }

          const erc20Promises = [];
          const promises = [];
          wallets.forEach((wallet) => {
            if (wallet.sdk !== 'ERC20') {
              promises.push(new Promise(async (res) => {
                await generate(wallet);
                res();
              }));
            }
          });
          await Promise.all(promises);

          wallets.forEach((wallet) => {
            if (wallet.sdk === 'ERC20') {
              erc20Promises.push(new Promise(async (res) => {
                const parentSDK = this.coinSDKS[wallet.parentSdk];
                const parentWallet = initializedWallets[wallet.parentName];
                const keyPair = parentSDK.generateKeyPair(parentWallet, 0);
                await generateErc20(keyPair, wallet);
                res();
              }));
            }
          });

          await Promise.all(erc20Promises);

          resolve();
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
