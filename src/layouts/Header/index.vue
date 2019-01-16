<template>
  <section class="header-section">
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
    <h1 class="header-h1">{{ heading }}</h1>

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
      authenticatedAccount: state => state.settings.authenticatedAccount,
    }),
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
      return this.$route.matched[0].path === '/wallet/balance/:id';
    },
    heading() {
      if (this.$route.name === 'exchange') return 'Exchange';
      if (this.$route.name === 'settings') return 'Settings';
      return 'CryptoWallet';
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
      this.$root.$emit('priceChartModalOpened', true);
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
  letter-spacing: 0.03em;
  font-size: 1em;
  margin-top: 0.3em;
  position: relative;
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
</style>
