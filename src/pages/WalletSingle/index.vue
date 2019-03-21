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
  name: 'Balance',

  components: {
    Transactions,
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

  mounted() {
    this.$root.$on('updateWalletSingle', async (done) => {
      try {
        await this.backEndService.loadPriceFeed();
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

      return false;
    },
  },
};
</script>

<style scoped>
</style>
