<template>
  <div>
    <q-modal
      v-model="open"
      class="dark-modal"
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
        <h1 class="header-h1">Currency</h1>
      </div>

      <div class="modal-layout-wrapper no-padding">
        <div
          v-for="key in currencies"
          :key="key"
          class="account-item"
        >
          <div>{{ $t(key) }}</div>

          <div class="default-switch">
            <q-radio
              v-model="selectedLocale"
              :val="key"
            />
          </div>
        </div>
      </div>
    </q-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Account from '@/store/wallet/entities/account';

export default {
  name: 'SelectCurrency',
  props: {
    open: {
      type: Boolean,
      required: true,
    },
    currentCurrency: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapState({
      authenticatedAccount: state => state.settings.authenticatedAccount,
    }),
    currencies() {
      return this.$store.state.settings.supportedCurrencies.map(item => item.code);
    },
    selectedLocale: {
      get() {
        return this.currentCurrency;
      },
      set(newCurrency) {
        Account.$update({
          where: record => record.id === this.authenticatedAccount,
          data: { currency: newCurrency },
        });
      },
    },
  },
  methods: {
    closeModal() {
      this.$emit('closeCurrencyModal');
    },
  },
};
</script>

<style>
</style>
