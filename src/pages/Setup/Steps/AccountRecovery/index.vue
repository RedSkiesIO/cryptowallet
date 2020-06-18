<template>
  <div>
    <div
      class="q-mb-xl"
      style="margin-top: -2.5rem"
    >
      <h1 class="setup ">
        {{ $t('accountRecovery') }}
      </h1>
      <div class="text-center">
        {{ $t('accountRecoveryDesc') }}
      </div>
    </div>

    <div class="container q-px-md">
      <div>
        <div class="q-mb-md q-pl-sm">
          <div class="text-h6 text-weight-bold">
            {{ $t('basicSecurity') }}
          </div>
          <div class="text-caption">
            {{ $t('basicSecurityDesc') }}
          </div>
        </div>
        <q-list>
          <q-item>
            <q-item-section
              avatar
              top
              class="q-pt-md"
            >
              <q-radio
                v-model="recoveryType"
                dark
                val="email"
                color="primary"
              />
            </q-item-section>
            <q-item-section class=" recovery-option q-pa-md">
              <q-item-label>
                <q-icon name="fas fa-at" />
                {{ $t('emailRecovery') }}
              </q-item-label>
              <div class="account-email-input-wrapper">
                <q-input
                  v-model.trim="accountEmail"
                  type="email"
                  outlined
                  dark
                  dense
                  color="primary"
                  :placeholder="$t('emailPlaceholder')"
                />
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <div class="q-mt-xl">
        <div class="q-mb-md q-pl-sm">
          <div class="text-h6 text-weight-bold">
            {{ $t('advancedSecurity') }}
          </div>
          <div class="text-caption">
            {{ $t('advancedSecurityDesc') }}
          </div>
        </div>
        <q-list>
          <q-item>
            <q-item-section
              avatar
              top
            >
              <q-radio
                v-model="recoveryType"
                dark
                val="recoveryPhrase"
                color="primary"
              />
            </q-item-section>
            <q-item-section class=" recovery-option q-pa-md">
              <q-item-label>
                <q-icon name="far fa-list-alt" />

                {{ $t('recoveryPhrase') }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <!-- <div class="account-name-input-wrapper">
      <q-input
        v-model.trim="accountEmail"
        outlined
        dark
        color="primary"
        placeholder="email@example.com"
      />
    </div> -->
      <div class="btns-wrapper q-mt-lg">
        <q-btn
          color="primary"
          text-color="blueish"
          :label="$t('next')"
          @click="validate"
        />
      </div>
    </div>
    <q-inner-loading :showing="visible">
      <q-spinner
        size="50px"
        color="primary"
      />
    </q-inner-loading>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import {
  required,
  email,
} from 'vuelidate/lib/validators';

export default {
  name: 'AccountRecovery',
  data() {
    return {
      accountEmail: '',
      recoveryType: 'email',
      visible: false,
    };
  },
  validations: {
    accountEmail: {
      required,
      email,
    },
  },
  computed: {
    ...mapState({
      delay: (state) => { return state.settings.delay; },
    }),
  },
  methods: {
    async validate() {
      if (this.recoveryType === 'recoveryPhrase') {
        this.$router.push({ path: '/setup/2' });
        return true;
      }
      if (!this.$v.accountEmail.required) {
        this.$toast.create(10, this.$t('enterAccountEmail'), this.delay.normal);
        return false;
      }

      if (!this.$v.accountEmail.email) {
        this.$toast.create(10, this.$t('invalidAccountEmail'), this.delay.normal);
        return false;
      }

      if (this.$magic.isLoggedIn()) {
        this.$magic.logout();
      }

      this.visible = true;
      await this.$magic.login(this.accountEmail);
      const mnemonic = await this.$magic.getMnemonic();
      const mnemonicArray = mnemonic.split(' ');
      this.$store.dispatch('setup/setSeed', mnemonicArray);
      this.$store.dispatch('setup/setSeedString', mnemonic);
      this.$router.push({ path: '/setup/4' });
      this.visible = false;

      return true;
    },
  },
};

</script>

<style scoped>
.account-email-input-wrapper {
  margin-top: 1rem;
  padding: 0 1em 0, 0;
}
.recovery-option {
  border: 1px solid lightgrey;
  border-radius: 5px;
}
</style>
