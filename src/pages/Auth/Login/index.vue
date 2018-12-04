<template>
  <div>
    <SelectAccount
      :select-account-modal-opened="selectAccountsModalOpened"
      @updateSelectAccountModalOpened="setAccountModalOpened"
    />
    <div v-if="account">
      <h1 class="account-name-h1">{{ account.name }}</h1>
      <pin-pad />
      <q-btn
        :label="$t('unlock')"
        style="color: goldenrod;"
        outline
        @click="attemptUnlock"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import PinPad from '@/components/Auth/PinPad';
import SelectAccount from '@/components/SelectAccount';

export default {

  components: {
    PinPad,
    SelectAccount,
  },

  data() {
    return {
      pin: [],
      selectAccountsModalOpened: false,
    };
  },

  computed: {
    ...mapState({
      selectedAccount: state => state.settings.selectedAccount,
    }),

    accounts() {
      return this.$store.getters['entities/account/query']().get();
    },

    /**
     * Computes the currently selected account
     */
    account() {
      if (this.selectedAccount) {
        return this.accounts.find(account => account.name === this.selectedAccount);
      }

      return this.accounts.find(account => account.default);
    },
  },

  beforeMount() {
    this.pinInputListener();
  },

  /**
   * If there is no account seleted, selects te default one
   */
  mounted() {
    if (!this.selectedAccount) {
      const defaultAccount = this.accounts.find(account => account.default);
      if (defaultAccount) this.$store.dispatch('settings/setSelectedAccount', defaultAccount.name);
    }
  },

  methods: {
    /**
     * Adds or removes pin input event to pin arr.
     */
    pinInputListener() {
      this.$root.$on('inputPin', (pinArr) => {
        this.pin = pinArr;
      });
    },

    /**
     * Compares bcrypt pin string to try and unlock an account
     */
    attemptUnlock() {
      if (this.$CWCrypto.bcryptCompareString(this.pin.join(''), this.account.pinHash) === true) {
        this.$store.dispatch('settings/setAuthenticatedAccount', this.account.id);
        this.$i18n.locale = this.account.locale;
        this.$router.push({ path: '/wallet' });
      }
    },

    setAccountModalOpened(value) {
      this.selectAccountsModalOpened = value;
    },
  },

};

</script>

<style scoped>
.account-name-h1 {
  font-size: 2.5rem;
  text-align: center;
  padding: 2rem;
}
</style>
