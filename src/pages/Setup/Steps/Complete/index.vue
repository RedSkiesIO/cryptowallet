<template>
  <div
    v-if="showContent"
    class="container"
  >
    <div>
      <h1 class="setup">
        {{ $t('completeSetup') }}
      </h1>
    </div>
    <div class="slide-wrapper">
      <div class="icon-wrapper">
        <q-icon
          name="wifi"
          size="10rem"
          color="white"
          class="temp-ill"
        />
      </div>
      <p>
        {{ $t('reconnectToInternet') }}
      </p>
    </div>
    <div class="btns-wrapper">
      <q-btn
        :disabled="!online"
        :label="$t('activateYourWallet')"
        color="yellow"
        text-color="blueish"
        @click="complete"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { Network } from '@/helpers';

export default {
  name: 'Complete',
  data() {
    return {
      online: null,
      account: null,
      showContent: false,
    };
  },
  computed: {
    ...mapState({
      authenticatedAccount: (state) => { return state.settings.authenticatedAccount; },
      setup: (state) => { return state.setup; },
      delay: (state) => { return state.settings.delay; },
    }),

    supportedCoins() {
      return this.$store.state.settings.supportedCoins;
    },
  },

  async mounted() {
    this.network = new Network(this.$q.platform.is);
    this.online = this.network.isOnline();

    this.network
      .on('offline', () => {
        this.online = false;
      })
      .on('online', () => {
        this.online = true;
      });
    if (!this.setup.accountCreated) {
      if (this.online) {
        await this.complete();
      } else {
        this.showContent = true;
      }
    }
  },

  methods: {
    /**
     * complete setup and store account entity.
     */
    async complete() {
      try {
        this.$store.dispatch('settings/setLoading', true);

        setTimeout(async () => {
          const account = await this.accountInitializer.createAccount(this.setup);
          this.$store.dispatch('settings/setSelectedAccount', this.setup.accountName);
          await this.accountInitializer.createWallets(this.setup, account.id, this.supportedCoins);
          await this.accountInitializer.createERC20Wallets(
            this.setup,
            account.id,
            this.supportedCoins,
          );
          this.$store.dispatch('setup/setAccountCreated');
          this.$store.dispatch('settings/setAuthenticatedAccount', account.id);

          Object.getPrototypeOf(this.$root).backEndService = new this.BackEndService(this.$root, this.authenticatedAccount, this.setup.pinArray.join(''));
          await this.backEndService.connect();
          await this.backEndService.loadPriceFeed();

          this.$store.dispatch('setup/clearSetupData');
          this.$store.dispatch('settings/setLayout', 'light');
          this.$router.push({ path: '/wallet' });

          setTimeout(() => {
            this.$store.dispatch('settings/setLoading', false);
          }, this.delay.normal);
        }, this.delay.normal);
      } catch (err) {
        this.errorHandler(err);
      }
    },
  },
};
</script>
<style>

.icon-wrapper {
  text-align: center;
}
.slide-wrapper {
  width: 100%;
  height: calc(100% - 7rem);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 .5rem;
}
</style>
