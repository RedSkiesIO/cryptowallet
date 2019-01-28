<template>
  <section
    v-if="!hideHeader"
    class="header-section"
  >
    <div class="header-back-button-wrapper">
      <q-btn
        :disable="!isBackButtonEnabled"
        icon="arrow_back"
        color="primary"
        size="lg"
        class="icon-btn back-arrow-btn"
        flat
        @click.prevent="goBack"
      />
    </div>

    <div v-if="coinHeading">
      <img
        :src="coinLogo"
        class="coin-logo"
      >
      {{ wallet.displayName }}
    </div>
    <div v-else>
      <div v-if="heading === 'CryptoWallet'">
        <h1 class="header-h1 logo">{{ heading }}</h1>
      </div>
      <div v-else>
        <h1 class="header-h1">{{ heading }}</h1>
      </div>
    </div>

    <div
      v-if="displaySettings"
      class="header-settings-button-wrapper"
    >
      <q-btn
        :label="$t('settings')"
        color="secondary"
        size="sm"
        @click.prevent="goToSettings"
      />
    </div>

    <div
      v-if="displayAddWallet"
      class="header-settings-button-wrapper"
    >
      <q-btn
        icon="add"
        color="primary"
        size="lg"
        class="icon-btn icon-btn-right"
        flat
        @click.prevent="openWalletsModal"
      />
    </div>

    <div
      v-if="displayPriceChart"
      class="header-settings-button-wrapper"
    >
      <q-btn
        icon="timeline"
        color="primary"
        size="lg"
        class="icon-btn icon-btn-right"
        flat
        @click.prevent="openChartModal"
      />
    </div>

    <div
      v-if="displayAccounts"
      class="header-accounts-button-wrapper"
    >
      <q-btn
        icon="people"
        color="primary"
        size="lg"
        class="icon-btn icon-btn-right"
        flat
        @click.prevent="setAccountModalOpened(true)"
      />
    </div>


  </section>
</template>

<script>
import { mapState } from 'vuex';
import SelectAccount from '@/components/Modals/SelectAccount';

export default {
  name: 'Header',
  components: {
    SelectAccount,
  },
  data() {
    return {
      isBackButtonEnabled: false,
    };
  },
  computed: {
    ...mapState({
      id: state => state.route.params.id,
      authenticatedAccount: state => state.settings.authenticatedAccount,
    }),
    wallet() {
      return this.$store.getters['entities/wallet/find'](this.id);
    },
    displaySettings() {
      // if (this.authenticatedAccount) return true;
      return false;
    },
    displayAccounts() {
      return this.$route.path === '/';
    },
    displayAddWallet() {
      return this.$route.path === '/wallet';
    },
    displayPriceChart() {
      return this.$route.name === 'walletSingle';
    },
    supportedCoins() {
      return this.$store.state.settings.supportedCoins;
    },
    heading() {
      if (this.$route.name === 'setup') return '';
      if (this.$route.name === 'exchange') return 'Exchange';
      if (this.$route.name === 'settings') return 'Settings';
      return 'CryptoWallet';
    },
    coinHeading() {
      if (this.$route.name === 'walletSingle' ||
          this.$route.name === 'coinSinglePrices') {
        return true;
      }
      return false;
    },
    hideHeader() {
      if (this.$route.path === '/setup/0') return true;
      return false;
    },
    coinLogo() {
      const coin = this.supportedCoins.find(cc => cc.name === this.wallet.name);
      /* eslint-disable-next-line */
      return require(`@/assets/cc-icons/color/${coin.symbol.toLowerCase()}.svg`);
    },
  },
  watch: {
    $route() {
      if (window.history.length > 0 &&
          this.$route.path !== '/setup/0' &&
          this.$route.path !== '/' &&
          this.$route.path !== '/wallet') {
        this.isBackButtonEnabled = true;
      } else {
        this.isBackButtonEnabled = false;
      }
    },
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    goToSettings() {
      this.$router.push({ path: '/settings' });
    },
    setAccountModalOpened(value) {
      this.$root.$emit('selectAccountModalOpened', value);
    },
    openWalletsModal() {
      this.$root.$emit('walletsModalOpened', true);
    },
    openChartModal() {
      this.$router.push({ path: `/wallet/single/prices/${this.wallet.id}` });
    },
  },
};
</script>

<style>
.header-section {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 2.5rem;
  font-family: 'CooperHewitt-Semibold';
  background: #1e3c57;
  position: relative;
}

.header-h1 {
  letter-spacing: normal;
  font-size: 1em;
  margin-top: 0.3em;
  position: relative;
}

.header-h1.logo {
  font-family: 'CooperHewitt-BoldItalic';
}

.header-back-button-wrapper {
  position: absolute;
  left: 0.5rem;
  height: 100%;
  display: flex;
  align-items: center;
}

.header-settings-button-wrapper,
.header-accounts-button-wrapper {
  position: absolute;
  right: 0.5rem;
  height: 100%;
  display: flex;
  align-items: center;
}

.header-accounts-button-wrapper {
  right: .8rem;
}

.icon-btn {
  margin: 0;
  padding-bottom: 0;
  min-height: auto;
  height: 100%;
  position: relative;
  width: 4em;
  padding: 0;
}

.back-arrow-btn .q-btn-inner {
  justify-content: flex-start;
}

.icon-btn-right .q-btn-inner {
  justify-content: flex-end;
}

.back-arrow-btn .q-focus-helper {
  display: none;
}

.coin-logo {
  height: 1.25rem;
  margin-right: 0.2rem;
  position: relative;
  top: 0.2em;
}
</style>
