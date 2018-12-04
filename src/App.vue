<template>
  <div id="q-app">
    <div
      v-if="settings.loading"
      class="app-loading"
    >
      <q-spinner
        :size="100"
        color="primary"
      />
    </div>
    <div v-else>
      <router-view/>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import toEncryptConfig from '@/plugins/AppDataEncryption/config.js';

export default {
  name: 'App',

  computed: {
    ...mapState({
      settings: state => state.settings,
    }),
  },

  watch: {
    /**
     * Encrypts and decrypts app data according to toEncryptConfig
     *
     * @todo Konrad Make it so the data in the Loki database is always encrypted
     * Meaning, ecrypt when saved to Loki, decrypt when hydrating
     */
    '$q.appVisible': {
      handler(visible) {
        const encryptionUtil = new this.AppDataEncryption(toEncryptConfig);
        if (visible) encryptionUtil.decrypt('pin hash');
        if (!visible) encryptionUtil.encrypt('pin hash');
      },
    },

    /**
     * Waits until hydration is completed,
     * If there are no Accounts, got to setup
     */
    'settings.loading': {
      handler(value) {
        if (value) return false;
        const accounts = this.$store.getters['entities/account/query']().get();
        if (accounts.length < 1) this.$router.push({ path: 'setup' });
        return true;
      },

      'settings.selectedAccount': {
        handler(value) {
          if (!value) this.$router.push({ path: '/' });
        },
      },
    },
  },


  beforeCreate() {

  },

  created() {
    if (!this.settings.selectedAccount) this.$router.push({ path: '/' });

    /* if (this.account.salt === null) {
      this.$router.push({ path: 'setup/seed' });
      return false;
    }

    if (this.account.pin === null) {
      this.$router.push({ path: 'setup/Pin' });
      return false;
    }

    return true; */
  },

  beforeMount() {

  },

  mounted() {

  },

  beforeUpdate() {

  },

  updated() {

  },

  beforeDestroy() {

  },

  destroyed() {

  },
};
</script>

<style lang='scss'>
@import 'bulma/sass/utilities/_all.sass';
@import 'bulma/sass/base/_all.sass';
@import 'bulma/sass/grid/columns.sass';
body {
  background-color: #1e3c57;
  color: white;
}

.app-loading {
    height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
