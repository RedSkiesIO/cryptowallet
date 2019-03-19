<template>
  <div>
    <q-dialog
      v-model="newAccountModalOpened"
      persistent
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
      content-class="dark-modal"
    >
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
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'NewAccount',
  data() {
    return {
      newAccountModalOpened: false,
    };
  },
  mounted() {
    this.$root.$on('newAccountModalOpened', (value) => {
      this.newAccountModalOpened = value;
    });
  },
  methods: {
    closeModal() {
      this.$root.$emit('newAccountModalOpened', false);
    },
    createAccount() {
      // @todo, don't use app global, should work
      /* eslint-disable-next-line */
      app.$root.$emit('selectAccountModalOpened', false);
      this.$root.$emit('newAccountModalOpened', false);
      this.$store.dispatch('setup/setAccountType', 'new');
      this.$router.push({ path: '/setup/2' });
    },
    importAccount() {
      // @todo, don't use app global, should work
      /* eslint-disable-next-line */
      app.$root.$emit('selectAccountModalOpened', false);
      this.$root.$emit('newAccountModalOpened', false);
      this.$store.dispatch('setup/setAccountType', 'restored');
      this.$router.push({ path: '/setup/1' });
    },
  },
};
</script>

<style>

</style>
