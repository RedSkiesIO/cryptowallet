<template>
  <div class="q-pt-xl">
    <div
      class="settings-row"
      @click.prevent="openSelectLanguageModal"
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
          @click.prevent="openSelectLanguageModal"
        />
      </div>
    </div>

    <div
      class="settings-row"
      @click.prevent="openSelectCurrencyModal"
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
          @click.prevent="openSelectCurrencyModal"
        />
      </div>
    </div>

    <div
      class="settings-row"
      @click.prevent="openNewPinModal"
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
          @click.prevent="openNewPinModal"
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
      @click.prevent="openDeleteAccountModal"
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
          @click.prevent="openDeleteAccountModal"
        />
      </div>
    </div>

    <SelectLanguage
      :current-locale="account.locale"
    />

    <SelectCurrency
      :current-currency="account.currency"
    />

    <Pin
      :pin-hash="account.pinHash"
    />

    <DeleteAccount
      :pin-hash="account.pinHash"
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
  computed: {
    ...mapState({
      authenticatedAccount: (state) => { return state.settings.authenticatedAccount; },
    }),
    account() {
      return this.$store.getters['entities/account/find'](this.authenticatedAccount);
    },
  },
  methods: {
    openSelectCurrencyModal() {
      this.$store.dispatch('modals/setSelectCurrencyModalOpened', true);
    },
    openSelectLanguageModal() {
      this.$store.dispatch('modals/setSelectLanguageModalOpened', true);
    },
    openDeleteAccountModal() {
      this.$store.dispatch('modals/setDeleteAccountModalOpened', true);
    },
    openNewPinModal() {
      this.$store.dispatch('modals/setNewPinModalOpened', true);
    },
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
