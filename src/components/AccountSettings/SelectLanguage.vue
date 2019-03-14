<template>
  <div>
    <q-dialog
      v-model="open"
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
          {{ $t('language') }}
        </h1>
      </div>

      <div class="modal-layout-wrapper no-padding">
        <div
          v-for="key in languages"
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
    </q-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Account from '@/store/wallet/entities/account';

export default {
  name: 'SelectLanguage',
  props: {
    open: {
      type: Boolean,
      required: true,
    },
    currentLocale: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapState({
      authenticatedAccount: (state) => { return state.settings.authenticatedAccount; },
    }),
    languages() {
      return Object.keys(this.$i18n.messages).map((key) => { return key; });
    },
    /**
     * Updates the database on locale change
     */
    selectedLocale: {
      get() {
        return this.currentLocale;
      },
      set(newLocale) {
        Account.$update({
          where: (record) => { return record.id === this.authenticatedAccount; },
          data: { locale: newLocale },
        });
        this.$i18n.locale = newLocale;
      },
    },
  },
  methods: {
    closeModal() {
      this.$emit('closeLanguageModal');
    },
  },
};
</script>

<style>
.lang-item {
  padding: 1rem 0.5rem;
  color: white;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid black;
}
</style>
