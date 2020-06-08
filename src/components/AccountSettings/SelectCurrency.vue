<template>
  <div>
    <q-dialog
      v-model="selectCurrencyModalOpened"
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
            {{ $t('currency') }}
          </h1>
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
                v-model="selectedCurrency"
                :val="key"
                dark
              />
            </div>
          </div>
        </div>
      </div>
    </q-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Account from '@/store/wallet/entities/account';
import Wallet from '@/store/wallet/entities/wallet';

export default {
  name: 'SelectCurrency',
  props: {
    currentCurrency: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapState({
      authenticatedAccount: (state) => { return state.settings.authenticatedAccount; },
    }),
    currencies() {
      return this.$store.state.settings.supportedCurrencies.map((item) => { return item.code; });
    },
    account() {
      return this.$store.getters['entities/account/find'](this.authenticatedAccount);
    },
    wallets() {
      return Wallet.query()
        .where('account_id', this.authenticatedAccount)
        .where('imported', true)
        .get();
    },
    selectedCurrency: {
      get() {
        return this.currentCurrency;
      },
      set(newCurrency) {
        Account.$update({
          where: (record) => { return record.id === this.authenticatedAccount; },
          data: { currency: newCurrency },
        });

        const currency = this.$store.state.settings.supportedCurrencies.find((item) => {
          return item.code === this.account.currency;
        });
        this.$store.dispatch('settings/setCurrency', currency);
      },
    },
    selectCurrencyModalOpened: {
      get() {
        return this.$store.state.modals.selectCurrencyModalOpened;
      },
      set(value) {
        this.$store.dispatch('modals/setSelectCurrencyModalOpened', value);
      },
    },
  },
  methods: {
    async refreshPrices() {
      const online = window ? window.navigator.onLine : navigator.connection === 'none';
      if (online) {
        const promises = [];
        this.wallets.forEach((wallet) => {
          promises.push(new Promise((res) => {
            return res(this.backEndService.loadCoinPriceData(wallet.symbol));
          }));
        });
        await Promise.all(promises);
      }
    },
    closeModal() {
      this.refreshPrices();
      this.selectCurrencyModalOpened = false;
    },
  },
};
</script>

<style>
</style>
