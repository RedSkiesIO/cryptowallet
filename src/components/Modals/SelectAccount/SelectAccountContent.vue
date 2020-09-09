<template>
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
        {{ $t('accounts') }}
      </h1>
      <div
        class="header-settings-button-wrapper"
      >
        <q-btn
          icon="person_add"
          color="primary"
          size="lg"
          class="icon-btn icon-btn-right"
          flat
          @click="newAccount"
        />
      </div>
    </div>

    <div class="modal-layout-wrapper no-padding">
      <div
        v-for="(account, index) in accounts"
        :key="index"
        class="account-item"
        @click="selectAccount(account.name)"
      >
        <div>
          {{ account.name }}
        </div>
        <div class="default-switch">
          <q-toggle
            v-model="account.default"
            :disabled="account.default"
            :label="$t('default')"
            @input="defaultAccountChange({
              val: account.default,
              name: account.name,
              id: account.id
            })"
          />
        </div>
        <div>
          <q-btn
            icon="chevron_right"
            size="lg"
            color="primary"
            class="list-chevron"
            flat
            @click="selectAccount(account.name)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Account from '@/store/wallet/entities/account.js';

export default {
  name: 'SelectAccountContent',
  computed: {
    accounts() {
      return this.$store.getters['entities/account/query']().get();
    },
  },
  methods: {
    closeModal() {
      this.$store.dispatch('modals/setSelectAccountModalOpened', false);
    },

    selectAccount(name) {
      this.$store.dispatch('settings/setSelectedAccount', name);
      this.$store.dispatch('modals/setSelectAccountModalOpened', false);
    },
    newAccount() {
      this.$store.dispatch('modals/setNewAccountModalOpened', true);
    },
    defaultAccountChange(data) {
      if (data.val) {
        this.accounts.forEach((account) => {
          Account.$update({
            where: account.id,
            data: { default: false },
          });
        });

        Account.$update({
          where: data.val.id,
          data: { default: true },
        });
      } else {
        Account.$update({
          where: data.id,
          data: { default: true },
        });
      }
    },
  },
};
</script>

<style lang='scss'>
.close-button-wrapper {
  padding: 0.5rem;
  height: 2.7rem;
}

.account-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin-bottom: 2px;
}

.default-switch {
  margin-left: auto;
}

.account-settings-button-wrapper {
  padding: 0.5rem;
}

.list-chevron {
  min-height: auto;
  padding: 0;
  padding-left: 2em;
  position: relative;
  right: -0.25em;
}

.list-chevron .q-btn__content {
  justify-content: flex-end;
}
</style>
