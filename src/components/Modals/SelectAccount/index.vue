<template>
  <div>
    <q-dialog
      v-model="selectAccountModalOpened"
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
          {{ $t('accounts') }}
        </h1>
        <div
          class="header-settings-button-wrapper"
        >
          <q-btn
            icon="add"
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
              @input="defualtAccountChange({
                val: account.default,
                name: account.name
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
    </q-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Account from '@/store/wallet/entities/account.js';

export default {
  name: 'SelectAccount',
  data() {
    return {
      selectAccountModalOpened: false,
    };
  },
  computed: {
    ...mapState({
      id: (state) => { return parseInt(state.route.params.id, 10); },
    }),
    accounts() {
      return this.$store.getters['entities/account/query']().get();
    },
  },
  mounted() {
    this.$root.$on('selectAccountModalOpened', (value) => {
      this.selectAccountModalOpened = value;
    });
  },
  methods: {
    closeModal() {
      this.$root.$emit('selectAccountModalOpened', false);
    },
    switchAccount() {
      this.$root.$emit('selectAccountModalOpened', true);
    },
    createAccount() {
      this.$root.$emit('selectAccountModalOpened', false);
      this.$store.dispatch('setup/setAccountType', 'new');
      this.$router.push({ path: '/setup/2' });
    },
    importAccount() {
      this.$root.$emit('selectAccountModalOpened', false);
      this.$store.dispatch('setup/setAccountType', 'restored');
      this.$router.push({ path: '/setup/1' });
    },
    selectAccount(name) {
      this.$store.dispatch('settings/setSelectedAccount', name);
      this.$root.$emit('selectAccountModalOpened', false);
    },
    newAccount() {
      this.$root.$emit('newAccountModalOpened', true);
    },
    defualtAccountChange(data) {
      if (data.val) {
        Account.$update({
          where: () => { return true; },
          data: { default: false },
        });

        Account.$update({
          where: (record) => { return record.name === data.name; },
          data: { default: true },
        });
      } else {
        Account.$update({
          where: (record) => { return record.name === data.name; },
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
  color: white;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.05);
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
