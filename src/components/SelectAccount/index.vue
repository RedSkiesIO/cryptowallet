<template>
  <div>
    <div class="account-settings-button-wrapper">
      <q-btn
        :label="$t('accounts')"
        icon="settings"
        color="primary"
        class="send-invitation"
        @click="switchAccount"
      />
    </div>

    <q-modal
      v-model="selectAccountModalOpened"
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

      <div
        v-for="(account, index) in accounts"
        :key="index"
        class="account-item"
      >
        <div>
          {{ account.name }}
        </div>
        <div class="default-switch">
          <q-toggle
            v-model="account.default"
            :disabled="account.default"
            :label="$t('default')"
            @input="defualtAccountChange({
              val: account.default,
              name: account.name
            })"
          />
        </div>
        <div>
          <q-btn
            :label="$t('switch')"
            size="sm"
            color="secondary"
            @click="selectAccount(account.name)"
          />
        </div>
      </div>

      <q-btn
        :label="$t('createAccount')"
        icon="add_box"
        color="primary"
        @click="createAccount"
      />
    </q-modal>
  </div>
</template>

<script>
import Account from '@/store/wallet/entities/account.js';

export default {
  name: 'SelectAccount',
  props: {
    selectAccountModalOpened: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    accounts() {
      return this.$store.getters['entities/account/query']().get();
    },
  },
  methods: {
    closeModal() {
      this.$emit('updateSelectAccountModalOpened', false);
    },
    switchAccount() {
      this.$emit('updateSelectAccountModalOpened', true);
    },
    createAccount() {
      this.$router.push({ path: '/setup' });
    },
    selectAccount(name) {
      this.$store.dispatch('settings/setSelectedAccount', name);
      this.$emit('updateSelectAccountModalOpened', false);
    },

    /**
     * Update the database when default account selected
     */
    defualtAccountChange(data) {
      if (data.val) {
        Account.$update({
          where: () => true,
          data: { default: false },
        });

        Account.$update({
          where: record => record.name === data.name,
          data: { default: true },
        });
      } else {
        Account.$update({
          where: record => record.name === data.name,
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

.dark-modal {
  .modal-content {
    background: #1e3c57;
  }
}

.account-item {
  display: flex;
  color: white;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.1);
  margin-bottom: 1px;
}

.default-switch {
  margin-left: auto;
  margin-right: 2rem;
}

.account-settings-button-wrapper {
  padding: 0.5rem;
}
</style>
