<template>
  <div class="center-content-wrapper">
    <div v-if="account">
      <h1 class="account-name-h1 setup">
        {{ account.name }}
      </h1>
      <PinPad
        ref="PinPad"
        mode="auth"
      />
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
      selectedAccount: (state) => { return state.settings.selectedAccount; },
      delay: (state) => { return state.settings.delay; },
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
    if (this.account) {
      this.$store.dispatch('settings/setSelectedAccount', this.account.name);
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
      if (this.pin.length >= minPinLength) {
        try {
          if (this.$CWCrypto.bcryptCompareString(this.pin.join(''), this.account.pinHash) === true) {
            this.$store.dispatch('settings/setLoading', true);
            this.$store.dispatch('settings/setAuthenticatedAccount', this.account.id);
            this.$i18n.locale = this.account.locale;

            const currency = this.$store.state.settings.supportedCurrencies.find((item) => {
              return item.code === this.account.currency;
            });

            this.$store.dispatch('settings/setCurrency', currency);

            await this.decryptData(this.account.id, this.pin.join(''));
            await this.initializeWallets(this.account.id);

            Object.getPrototypeOf(this.$root).backEndService = new this.BackEndService(this.$root, this.account.id, this.pin.join(''));
            const connect = await this.backEndService.connect();
            if (connect) {
              await this.backEndService.loadPriceFeed();
            }
            this.$router.push({ path: '/wallet' });
            this.$store.dispatch('settings/setLayout', 'light');

            setTimeout(() => {
              this.$store.dispatch('settings/setLoading', false);
            }, this.delay.long);
          } else {
            this.$toast.create(10, this.$t('wrongPin'), this.delay, 'top');
            this.$refs.PinPad.resetState();
            this.resetPin();
          }
        } catch (err) {
          this.errorHandler(err);
        }
      }
    },


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
              if (item[key]) {
                item[key] = this.decrypt(item[key], pass);
              }
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
      return new Promise(async (resolve) => {
        const initializedWallets = {};
        this.activeWallets[accountId] = initializedWallets;

        const wallets = Wallet.query()
          .where('account_id', accountId)
          .where('enabled', true)
          .get();
        if (wallets.length === 0) {
          resolve();
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
              await generateErc20(wallet);
              res();
            }));
          }
        });

        await Promise.all(erc20Promises);

        resolve();
      });
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
