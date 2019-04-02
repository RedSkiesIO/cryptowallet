<template>
  <div />
</template>


<script>
import { mapState } from 'vuex';

export default {
  name: 'Complete',
  computed: {
    ...mapState({
      setup: (state) => { return state.setup; },
    }),

    supportedCoins() {
      return this.$store.state.settings.supportedCoins;
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
      try {
        console.log('got here', this.setup);
        const account = await this.accountInitializer.createAccount(this.setup);
        this.$store.dispatch('settings/setSelectedAccount', this.setup.accountName);
        await this.accountInitializer.createWallets(this.setup, account.id, this.supportedCoins);
        await this.accountInitializer.createERC20Wallets(
          this.setup,
          account.id,
          this.supportedCoins,
        );
        Object.getPrototypeOf(this.$root).backEndService = new this.BackEndService(this.$root, account.id, this.setup.pinArray.join(''));
        await this.backEndService.connect();
        await this.backEndService.loadPriceFeed();
        this.$store.dispatch('settings/setAuthenticatedAccount', account.id);
        this.$store.dispatch('settings/setLayout', 'light');
        this.$router.push({ path: '/wallet' });
        this.$store.dispatch('setup/clearSetupData');
        this.$store.dispatch('settings/setLoading', false);
      } catch (err) {
        this.errorHandler(err);
      }
    },
  },
};
</script>
