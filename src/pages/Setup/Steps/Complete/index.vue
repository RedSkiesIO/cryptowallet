<template>
  <div />
</template>

<script>
import { uid } from 'quasar';
import { mapState } from 'vuex';
import Account from '@/store/wallet/entities/account';
import Wallet from '@/store/wallet/entities/wallet';

export default {
  name: 'Complete',
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    ...mapState({
      setup: (state) => { return state.setup; },
    }),

    supportedCoins() {
      return this.$store.state.settings.supportedCoins;
    },
    accounts() {
      return this.$store.getters['entities/account/query']().get();
    },
  },

  mounted() {
    const delay = 500;
    this.$store.dispatch('settings/setLoading', true);
    setTimeout(() => {
      this.complete();
    }, delay);
  },

  methods: {
    /**
     * complete setup and store account entity.
     */
    async complete() {
      const accounts = this.$store.getters['entities/account/query']().get();
      const password = this.setup.pinArray.join('');
      const pinHash = this.$CWCrypto.bcryptHashString(password, this.setup.salt);
      const data = {
        uid: uid(),
        name: this.setup.accountName,
        salt: this.setup.salt,
        pinHash,
        default: accounts.length === 0,
        locale: this.setup.accountLocale || this.accounts[0].locale,
        node: this.setup.accountIpNode,
        seed: Object.values(this.setup.seed),
      };

      this.$store.dispatch('settings/setSelectedAccount', data.name);

      try {
        const result = await Account.$insert({
          data,
          password,
        });

        const { id } = result.account[0];
        const promises = [];
        const erc20Promises = [];

        this.supportedCoins.forEach((coin) => {
          const wallet = {
            account_id: id,
            name: coin.name,
            displayName: coin.displayName,
            symbol: coin.symbol,
            sdk: coin.sdk,
            network: coin.network,
          };

          if (coin.sdk !== 'ERC20') {
            promises.push(new Promise(async (resolve) => {
              wallet.hdWallet = await this.coinSDKS[coin.sdk].generateHDWallet(
                Object.values(this.setup.seed).join(' ').trim(),
                coin.network,
              );
              await Wallet.$insert({ data: wallet, password });
              resolve();
            }));
          } else {
            erc20Promises.push(new Promise(async (resolve) => {
              const parentSDK = await this.coinSDKS[coin.parentSdk];
              const parentWallet = await parentSDK.generateHDWallet(
                Object.values(this.setup.seed).join(' ').trim(),
                coin.network,
              );
              const keyPair = parentSDK.generateKeyPair(parentWallet, 0);

              wallet.erc20Wallet = await this.coinSDKS[coin.sdk].generateERC20Wallet(
                keyPair,
                coin.name,
                coin.symbol,
                coin.contractAddress,
                coin.decimals,
              );

              wallet.parentSdk = coin.parentSdk;
              wallet.parentName = coin.parentName;
              wallet.contractAddress = coin.contractAddress;
              wallet.decimals = coin.decimals;

              await Wallet.$insert({ data: wallet });
              resolve();
            }));
          }
        });

        await Promise.all(promises);
        await Promise.all(erc20Promises);

        Object.getPrototypeOf(this.$root).backEndService = new this.BackEndService(this.$root, id, this.setup.pinArray.join(''));

        await this.backEndService.connect();
        await this.backEndService.loadPriceFeed();
        this.$store.dispatch('settings/setAuthenticatedAccount', id);
        this.$store.dispatch('settings/setLayout', 'light');
        this.$router.push({ path: '/wallet' });
        this.$store.dispatch('setup/clearSetupData');
        this.$store.dispatch('settings/setLoading', false);
      } catch (err) {
        console.log(err);
        this.errorHandler(err);
      }
    },
  },
};
</script>
