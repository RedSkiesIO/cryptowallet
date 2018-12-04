<template>
  <section class="header-section">
    <div class="header-back-button-wrapper">
      <q-btn
        :disable="!isBackButtonEnabled"
        :label="$t('goBack')"
        color="secondary"
        size="sm"
        @click.prevent="goBack"
      />
    </div>
    <h1 class="header-h1">CryptoWallet</h1>

    <div class="header-settings-button-wrapper">
      <q-btn
        :label="$t('settings')"
        color="secondary"
        size="sm"
        @click.prevent="goToSettings"
      />
    </div>


  </section>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      isBackButtonEnabled: false,
    };
  },
  watch: {
    $route() {
      if (window.history.length > 0) {
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
  },
};
</script>

<style scoped>
  .header-section {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 2.5em;
    font-family: 'CooperHewitt-Semibold';
    background: #1e3c57;
    position: relative;
  }

  .header-h1 {
    letter-spacing: 0.03em;
    font-size: 1em;
    margin-top: 0.4em;
  }

  .header-back-button-wrapper {
    position: absolute;
    left: 0.5rem;
    height: 100%;
    display: flex;
    align-items: center;
  }

  .header-settings-button-wrapper {
    position: absolute;
    right: 0.5rem;
    height: 100%;
    display: flex;
    align-items: center;
  }

</style>
