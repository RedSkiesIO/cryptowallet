<template>
  <div>
    <div
      class="settings-row"
      @click="languageOpen=true"
    >
      <div>
        {{ $t('language') }}
      </div>
      <div>
        <q-btn
          icon="chevron_right"
          size="lg"
          color="blueish"
          class="settings-chevron"
          flat
          @click="languageOpen=true"
        />
      </div>
    </div>

    <div
      class="settings-row"
      @click="currencyOpen = true"
    >
      <div>
        {{ $t('currency') }}
      </div>
      <div>
        <q-btn
          icon="chevron_right"
          size="lg"
          color="blueish"
          class="settings-chevron"
          flat
          @click="currencyOpen = true"
        />
      </div>
    </div>

    <div
      class="settings-row"
      @click="pinOpen = true"
    >
      <div>
        {{ $t('pinCode') }}
      </div>
      <div>
        <q-btn
          icon="chevron_right"
          size="lg"
          color="blueish"
          class="settings-chevron"
          flat
          @click="pinOpen = true"
        />
      </div>
    </div>

    <div
      class="settings-row"
      @click="logout"
    >
      <div>
        {{ $t('logout') }}
      </div>
      <div>
        <q-btn
          icon="chevron_right"
          size="lg"
          color="blueish"
          class="settings-chevron"
          flat
          @click="logout"
        />
      </div>
    </div>

    <div
      class="settings-row"
      @click="deleteAccountOpen = true"
    >
      <div>
        {{ $t('deleteAccount') }}
      </div>
      <div>
        <q-btn
          icon="chevron_right"
          size="lg"
          color="blueish"
          class="settings-chevron"
          flat
          @click="deleteAccountOpen = true"
        />
      </div>
    </div>

    <SelectLanguage
      :open="languageOpen"
      :current-locale="account.locale"
      @closeLanguageModal="languageOpen=false"
    />

    <SelectCurrency
      :open="currencyOpen"
      :current-currency="account.currency"
      @closeCurrencyModal="currencyOpen=false"
    />

    <Pin
      :open="pinOpen"
      :pin-hash="account.pinHash"
      @closePinModal="pinOpen=false"
    />

    <DeleteAccount
      :open="deleteAccountOpen"
      :pin-hash="account.pinHash"
      @closePinModal="deleteAccountOpen=false"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import SelectLanguage from '@/components/AccountSettings/SelectLanguage';
import SelectCurrency from '@/components/AccountSettings/SelectCurrency';
import Pin from '@/components/AccountSettings/Pin';
import DeleteAccount from '@/components/AccountSettings/DeleteAccount';

export default {
  name: 'AccountSettings',
  components: {
    SelectLanguage,
    SelectCurrency,
    Pin,
    DeleteAccount,
  },
  data() {
    return {
      languageOpen: false,
      nodeOpen: false,
      pinOpen: false,
      deleteAccountOpen: false,
      currencyOpen: false,
    };
  },
  computed: {
    ...mapState({
      authenticatedAccount: (state) => { return state.settings.authenticatedAccount; },
      delay: (state) => { return state.settings.delay; },
    }),
    account() {
      return this.$store.getters['entities/account/find'](this.authenticatedAccount);
    },
  },
  methods: {
    logout() {
      window.location.reload(true);
    },
  },
};
</script>

<style>
.settings-row {
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid whitesmoke;
  height: 3.5rem;
  display: flex;
  align-items: center;
  font-family: 'Montserrat-Medium';
}

.settings-chevron {
  height: 2em!important;
  min-height: auto;
  padding: 0;
  padding-left: 2em;
  position: relative;
  right: -0.25em;
}

.settings-chevron .q-btn__content {
  justify-content: flex-end;
}

</style>
