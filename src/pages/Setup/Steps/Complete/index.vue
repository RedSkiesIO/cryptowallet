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
      delay: (state) => { return state.settings.delay; },
    }),

    supportedCoins() {
      return this.$store.state.settings.supportedCoins;
    },
  },

  mounted() {
    this.$store.dispatch('settings/setLoading', true);
    setTimeout(() => {
      if (this.setup.accountName) {
        this.complete();
      }
    }, this.delay.normal);
  },

  methods: {
    /**
     * complete setup and store account entity.
     */
    async complete() {
      try {
        const account = await this.accountInitializer.createAccount(this.setup);
        this.$store.dispatch('settings/setSelectedAccount', this.setup.accountName);
        await this.accountInitializer.createWallets(this.setup, account.id, this.supportedCoins);
        await this.accountInitializer.createERC20Wallets(
          this.setup,
          account.id,
          this.supportedCoins,
        );

        if (!this.backEndService) {
          Object.getPrototypeOf(this.$root).backEndService = new this.BackEndService(this.$root, account.id, this.setup.pinArray.join(''));
          await this.backEndService.connect();
          await this.backEndService.loadPriceFeed();
        }

        this.$store.dispatch('setup/clearSetupData');
        this.$store.dispatch('settings/setAuthenticatedAccount', account.id);
        this.$store.dispatch('settings/setLayout', 'light');
        this.$router.push({ path: '/wallet' });

        setTimeout(() => {
          this.$store.dispatch('settings/setLoading', false);
        }, this.delay.normal);
      } catch (err) {
        this.errorHandler(err);
      }
    },
  },
};
</script>
