<template>
  <q-dialog
    v-model="updateEmailModalOpened"
    :maximized="true"
    transition-show="slide-up"
    transition-hide="slide-down"
    content-class="dark-modal"
  >
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
          {{ $t('updateEmail') }}
        </h1>
      </div>
      <div class="modal-layout-wrapper center">
        <div>
          <h1 class="setup">
            {{ $t('setNewEmail') }}
          </h1>
        </div>
        <div class="account-name-input-wrapper">
          <q-input
            v-model.trim="newEmail"
            :float-label="$t('email')"
            outlined
            dark
            color="primary"
          />
        </div>
        <div class="btns-wrapper">
          <q-btn
            color="yellow"
            text-color="blueish"
            label="Update"
            @click="validate"
          />
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'UpdateEmail',
  data() {
    return {
      newEmail: null,
    };
  },
  computed: {
    ...mapState({
      authenticatedAccount: (state) => { return state.settings.authenticatedAccount; },
      delay: (state) => { return state.settings.delay; },
    }),
    updateEmailModalOpened: {
      get() {
        return this.$store.state.modals.updateEmailModalOpened;
      },
      set(value) {
        this.$store.dispatch('modals/setUpdateEmailModalOpened', value);
      },
    },
  },
  methods: {
    async changeEmail() {
      console.log('do something');
      await this.$magic.updateEmail();
    },
    closeModal() {
      this.updateEmailModalOpened = false;
    },
  },
};
</script>

<style>

</style>
