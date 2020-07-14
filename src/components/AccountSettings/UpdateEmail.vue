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
        <div
          v-if="loggedIn"
          class="q-gutter-y-md "
        >
          <div>
            <h1 class="setup">
              {{ $t('setNewEmail') }}
            </h1>
          </div>
          <div class="account-name-input-wrapper">
            <q-input
              v-model.trim="newEmail"
              :float-label="$t('email')"
              type="email"
              outlined
              color="primary"
              :placeholder="$t('emailPlaceholder')"
            />
          </div>
          <div class="btns-wrapper">
            <q-btn
              color="secondary"
              text-color="info"
              label="Update"
              @click="changeEmail"
            />
          </div>
        </div>
        <div v-else>
          <div class="text-center">
            {{ $t('emailLogin') }} {{ email }}
          </div>
          <div class="btns-wrapper">
            <q-btn
              color="secondary"
              text-color="info"
              label="Login"
              @click="login"
            />
          </div>
        </div>
      </div>
    </div>
  </q-dialog>
</template>

<script>
import { mapState } from 'vuex';
import {
  required,
  email,
} from 'vuelidate/lib/validators';
import Account from '@/store/wallet/entities/account';

export default {
  name: 'UpdateEmail',
  data() {
    return {
      loggedIn: false,
      newEmail: null,
    };
  },
  validations: {
    newEmail: {
      required,
      email,
    },
  },
  computed: {
    ...mapState({
      authenticatedAccount: (state) => { return state.settings.authenticatedAccount; },
      delay: (state) => { return state.settings.delay; },
    }),
    email() {
      return this.$store.getters['entities/account/find'](this.authenticatedAccount).email;
    },
    updateEmailModalOpened: {
      get() {
        return this.$store.state.modals.updateEmailModalOpened;
      },
      set(value) {
        this.$store.dispatch('modals/setUpdateEmailModalOpened', value);
      },
    },
  },
  async mounted() {
    this.$store.dispatch('settings/setLoading', true);
    const isLoggedIn = await this.$magic.isLoggedIn();
    if (isLoggedIn) {
      this.loggedIn = true;
    }
    this.$store.dispatch('settings/setLoading', false);
  },
  methods: {
    async login() {
      const login = await this.$magic.login(this.email);
      if (login) {
        this.loggedIn = true;
      }
    },
    async changeEmail() {
      if (!this.$v.newEmail.required) {
        this.$toast.create(10, this.$t('enterAccountEmail'), this.delay.normal);
        return false;
      }

      if (!this.$v.newEmail.email) {
        this.$toast.create(10, this.$t('invalidAccountEmail'), this.delay.normal);
        return false;
      }

      const newEmail = await this.$magic.updateEmail(this.newEmail);
      if (newEmail) {
        Account.$update({
          where: (record) => { return record.id === this.authenticatedAccount; },
          data: { email: this.newEmail },
        });
        this.closeModal();
        this.$toast.create(0, this.$t('emailUpdated'), this.delay.vlong);
        return true;
      }
      return false;
    },
    closeModal() {
      this.updateEmailModalOpened = false;
    },
  },
};
</script>

<style>

</style>
