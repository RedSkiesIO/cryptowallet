<template>
  <div v-if="wallet">
    <Transactions :wallet="wallet" />
  </div>
</template>

<script>
import Transactions from '@/components/Wallet/Transactions';
import { mapState } from 'vuex';
import { refreshWallet } from '@/helpers';

export default {
  name: 'WalletSingle',

  components: {
    Transactions,
  },

  data() {
    return {
      checkForUpdates: null,
    };
  },

  computed: {
    ...mapState({
      id: (state) => { return state.route.params.id; },
      authenticatedAccount: (state) => { return state.settings.authenticatedAccount; },
      delay: (state) => { return state.settings.delay; },
    }),

    wallet() {
      return this.$store.getters['entities/wallet/find'](this.id);
    },
  },

  // beforeRouteLeave(to, from, next) {
  //   if (this.checkForUpdates) {
  //     clearInterval(this.checkForUpdates);
  //   }
  //   next();
  // },

  mounted() {
    // this.checkForUpdates = setInterval(() => {
    //   return refreshWallet(this.coinSDKS[this.wallet.sdk],
    //     this.wallet, this.authenticatedAccount,
    //     false);
    // // eslint-disable-next-line no-magic-numbers
    // }, 10000);

    this.$root.$on('updateWalletSingle', async (done) => {
      try {
        await this.backEndService.loadCoinPriceData(this.wallet.symbol);
        await this.refresher(done);
      } catch (err) {
        this.errorHandler(err);
        done();
      }
    });
  },

  methods: {
    /**
     * Performs a wallet update
     */
    async refresher(done) {
      const coinSDK = this.coinSDKS[this.wallet.sdk];
      await refreshWallet(coinSDK, this.wallet, this.authenticatedAccount);
      setTimeout(() => {
        done();
      }, this.delay.normal);
    },
  },
};
</script>

<style scoped>

</style>
