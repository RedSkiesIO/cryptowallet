<template>
  <div>
    <div class="settings-row">
      <div>
        {{ account.name }}
      </div>
      <div>
        <q-btn
          :label="$t('logout')"
          color="secondary"
          size="sm"
          @click="logout"
        />
      </div>
    </div>

    <div class="settings-row">
      <div>
        {{ $t('language') }}
      </div>
      <div>
        <q-btn
          :label="$t(account.locale)"
          color="secondary"
          size="sm"
          @click="changeLanguage"
        />
      </div>
    </div>

    <div class="settings-row">
      <div>
        {{ $t('node') }}
      </div>
      <div>
        <q-btn
          :label="account.node"
          color="secondary"
          size="sm"
          @click="changeNodeIP"
        />
      </div>
    </div>

    <div class="settings-row">
      <div>
        {{ $t('pinCode') }}
      </div>
      <div>
        <q-btn
          :label="$t('change')"
          color="secondary"
          size="sm"
          @click="changePin"
        />
      </div>
    </div>

    <div class="settings-row">
      <div>
        {{ $t('deleteAccount') }}
      </div>
      <div>
        <q-btn
          :label="$t('delete')"
          color="secondary"
          size="sm"
          @click="deleteAccount"
        />
      </div>
    </div>

    <SelectLanguage
      :open="languageOpen"
      :current-locale="account.locale"
      @closeLanguageModal="languageOpen=false"
    />

    <Node
      :open="nodeOpen"
      :current="account.node"
      @closeNodeModal="nodeOpen=false"
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
import Node from '@/components/AccountSettings/Node';
import Pin from '@/components/AccountSettings/Pin';
import DeleteAccount from '@/components/AccountSettings/DeleteAccount';

export default {
  name: 'AccountSettings',
  components: {
    SelectLanguage,
    Node,
    Pin,
    DeleteAccount,
  },
  data() {
    return {
      languageOpen: false,
      nodeOpen: false,
      pinOpen: false,
      deleteAccountOpen: false,
    };
  },
  computed: {
    ...mapState({
      authenticatedAccount: state => state.settings.authenticatedAccount,
    }),
    account() {
      return this.$store.getters['entities/account/find'](this.authenticatedAccount);
    },
  },
  methods: {
    logout() {
      this.$router.push({ path: '/' });
      this.$store.dispatch('settings/setAuthenticatedAccount', null);
    },
    changeLanguage() {
      this.languageOpen = true;
    },
    changeNodeIP() {
      this.nodeOpen = true;
    },
    changePin() {
      this.pinOpen = true;
    },
    deleteAccount() {
      this.deleteAccountOpen = true;
    },
  },
};
</script>

<style lang="scss">
.settings-row {
  padding: 1rem;;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid black;
}
</style>
