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
          text-color="blueish"
          @click="createAccount"
        />
      </div>
      <div class="btns-wrapper">
        <q-btn
          :label="$t('importAccount')"
          icon="get_app"
          color="primary"
          text-color="blueish"
          @click="importAccount"
        />
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
  },
};
</script>

<style>

</style>
