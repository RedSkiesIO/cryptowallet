<template>
  <q-modal
    v-model="open"
    class="dark-modal"
  >
    <div class="close-button-wrapper">
      <q-btn
        :label="$t('close')"
        color="secondary"
        size="sm"
        @click="closeModal()"
      />
    </div>

    <div>
      <div
        v-for="key in languages"
        :key="key"
        class="lang-item"
      >
        <div>{{ $t(key) }}</div>

        <div>
          <q-radio
            v-model="selectedLocale"
            :val="key"
          />
        </div>
      </div>
    </div>
  </q-modal>
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
      authenticatedAccount: state => state.settings.authenticatedAccount,
    }),
    languages() {
      return Object.keys(this.$i18n.messages).map(key => key);
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
          where: record => record.id === this.authenticatedAccount,
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
