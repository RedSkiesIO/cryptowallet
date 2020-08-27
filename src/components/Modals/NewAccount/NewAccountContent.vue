<template>
  <div>
    <div class="header-section">
      <div class="header-back-button-wrapper">
        <q-btn
          icon="arrow_back"
          size="lg"
          class="icon-btn back-arrow-btn"
          flat
          @click.prevent="closeModal"
        />
      </div>
      <h1 class="header-h1">
        {{ $t('newAccount') }}
      </h1>
    </div>

    <div class="modal-layout-wrapper centered">
      <div>
        <q-btn
          :label="$t('createAccount')"
          icon="add_box"
          color="primary"
          text-color="white"
          @click="createAccount"
        />
      </div>
      <div class="advanced-dropdown q-mt-sm">
        <q-expansion-item
          label="Advanced"
          color="info"
        >
          <q-btn
            :label="$t('seedPhraseCreate')"
            flat
            no-caps
            dense
            class="import-account-btn"
            text-color="blue"
            size="13px"
            @click="seedPhrase()"
          />
          <q-btn
            :label="$t('seedPhraseImport')"
            flat
            no-caps
            dense
            class="import-account-btn"
            text-color="blue"
            size="13px"
            @click="importAccount()"
          />
        </q-expansion-item>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NewAccountContent',
  methods: {
    closeModal() {
      this.$store.dispatch('modals/setNewAccountModalOpened', false);
    },
    createAccount() {
      this.$store.dispatch('modals/setSelectAccountModalOpened', false);
      this.$store.dispatch('modals/setNewAccountModalOpened', false);
      this.$store.dispatch('setup/setAccountType', 'new');
      this.$router.push({ path: '/setup/8' });
    },
    importAccount() {
      this.$store.dispatch('modals/setSelectAccountModalOpened', false);
      this.$store.dispatch('modals/setNewAccountModalOpened', false);
      this.$store.dispatch('setup/setAccountType', 'restored');
      this.$router.push({ path: '/setup/1' });
    },

    seedPhrase() {
      this.$store.dispatch('setup/setAccountLocale', this.selectedLang.value);
      this.$store.dispatch('setup/setAccountCurrency', this.$t('supportedCurrency'));
      this.$store.dispatch('setup/setAccountType', 'new');
      this.$router.push({ path: '/setup/2' });
    },
  },
};
</script>

<style>
.import-account-btn {
  width: 15rem;
}
.advanced-dropdown .q-expansion-item__container {
  position: absolute;
  left: 50%;
  transform: translate(-50%);
}

.advanced-dropdown .q-item {
  justify-content: center;
  min-height: 0px;
}

.advanced-dropdown .q-item__section--main {
  flex: none;
}

.advanced-dropdown .q-item__section--main ~ .q-item__section--side {
  padding-left: 2px;
}
</style>
