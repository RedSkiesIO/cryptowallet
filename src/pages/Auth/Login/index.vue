<template>
  <div class="center-content-wrapper">
    <div v-if="account">
      <h1 class="account-name-h1 setup">{{ account.name }}</h1>
      <pin-pad mode="auth"/>
    </div>
  </div>
</template>

<script>
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
    async attemptUnlock() {
      if (this.$CWCrypto.bcryptCompareString(this.pin.join(''), this.account.pinHash) === true) {
        this.$store.dispatch('settings/setAuthenticatedAccount', this.account.id);
        this.$i18n.locale = this.account.locale;

        await this.decryptData(this.account.id, this.pin.join(''));

        this.initializeWallets(this.account.id)
          .then(() => {
            this.$router.push({ path: '/wallet' });
          });
      }
    },

    /**
     * Decrypts and returns a piece of data
     * @param  {Uint8Array} data
     * @param  {String} password
     * @return {Any}
     */
    decrypt(data, password) {
      try {
        const bytes = AES.decrypt(data, password);
        return JSON.parse(bytes.toString(encUTF8));
      } catch (exception) {
        throw new Error(exception.message);
      }
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
      });
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

          async function generate(wallet, vm, mnemonic) {
            initializedWallets[wallet.name] = vm.coinSDKS[wallet.sdk].generateHDWallet(
              mnemonic,
              wallet.network,
            );
          }
          async function generateErc20(keyPair, wallet, vm) {
            initializedWallets[wallet.name] = vm.coinSDKS[wallet.sdk].generateERC20Wallet(
              keyPair,
              wallet.name,
              wallet.symbol,
              wallet.contractAddress,
              wallet.decimals,
            );
          }

          const erc20Promises = [];
          const promises = [];
          wallets.forEach((wallet) => {
            if (wallet.sdk !== 'ERC20') {
              promises.push(new Promise(async (res) => {
                await generate(wallet, this, this.account.seed.join(' ').trim());
                res();
              }));
            }
          });
          Promise.all(promises);

          wallets.forEach((wallet) => {
            if (wallet.sdk === 'ERC20') {
              erc20Promises.push(new Promise(async (res) => {
                const parentSDK = this.coinSDKS[wallet.parentSdk];
                const parentWallet = initializedWallets[wallet.parentName];
                const keyPair = parentSDK.generateKeyPair(parentWallet, 0);
                await generateErc20(keyPair, wallet, this);
                res();
              }));
            }
          });

          Promise.all(erc20Promises);

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
