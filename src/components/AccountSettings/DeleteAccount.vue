<template>
  <q-dialog
    v-model="deleteAccountModalOpened"
    persistent
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
          {{ $t('deleteAccount') }}
        </h1>
      </div>
      <div class="modal-layout-wrapper center">
        <h1 class="setup with-margin">
          <span>
            {{ $t('enterPin') }}
          </span>
        </h1>
        <PinPad
          ref="PinPad"
          mode="delete"
          @inputPin="pinInputListener"
          @attemptUnlock="attemptUnlock"
          @resetPin="resetPin"
        />
      </div>
      <q-dialog
        v-model="confirmDeleteOpen"
      >
        <q-card
          v-if="account"
          style="width: 300px"
          class="dialog"
        >
          <q-card-section>
            <h2>
              {{ $t('confirm') }}
            </h2>
            <p>
              {{ `${$t('confirmMessage')} ${account.name}${$t('questionMark')}` }}
            </p>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              v-close-popup
              flat
              :label="$t('cancelConfirm')"
              color="blueish"
            />
            <q-btn
              flat
              :label="$t('acceptConfirm')"
              color="blueish"
              @click="deleteAccount()"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </q-dialog>
</template>

<script>
import { mapState } from 'vuex';
import Account from '@/store/wallet/entities/account';
import Address from '@/store/wallet/entities/address';
import Tx from '@/store/wallet/entities/tx';
import Utxo from '@/store/wallet/entities/utxo';
import Wallet from '@/store/wallet/entities/wallet';
import PinPad from '@/components/Auth/PinPad';

export default {
  name: 'Pin',
  components: {
    PinPad,
  },
  props: {
    pinHash: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      confirmDeleteOpen: false,
      pin: [],
    };
  },
  computed: {
    ...mapState({
      authenticatedAccount: (state) => { return state.settings.authenticatedAccount; },
      delay: (state) => { return state.settings.delay; },
    }),
    account() {
      return this.$store.getters['entities/account/find'](this.authenticatedAccount);
    },
    accounts() {
      return this.$store.getters['entities/account/query']().get();
    },
    deleteAccountModalOpened: {
      get() {
        return this.$store.state.modals.deleteAccountModalOpened;
      },
      set(value) {
        this.$store.dispatch('modals/setDeleteAccountModalOpened', value);
      },
    },
  },
  methods: {
    resetPin() {
      this.pin = [];
    },
    /**
     * Adds or removes pin input event to pin arr.
     */
    pinInputListener(pin) {
      this.pin.push(pin);
    },
    /**
     * Compares bcrypt pin string to try and unlock an account
     */
    attemptUnlock() {
      if (this.$CWCrypto.bcryptCompareString(this.pin.join(''), this.account.pinHash) === true) {
        this.$refs.PinPad.resetState();
        this.resetPin();
        this.confirmDeleteOpen = true;
      } else {
        this.$toast.create(10, this.$t('wrongPin'), this.delay.normal, 'top');
        this.$refs.PinPad.resetState();
        this.resetPin();
      }
    },

    /**
     * Closes the modal and resets state
     */
    closeModal() {
      this.$refs.PinPad.resetState();
      this.resetPin();
      Object.assign(this.$data, this.$options.data.apply(this));
      this.deleteAccountModalOpened = false;
    },

    deleteAccount() {
      const { id } = this.account;
      const wasDefault = this.account.default;

      this.$store.dispatch('settings/setLoading', true);
      this.$store.dispatch('settings/setSelectedAccount', null);
      this.$store.dispatch('settings/setAuthenticatedAccount', null);

      this.closeModal();
      this.$router.push({ path: '/' });

      this.$store.dispatch('settings/setLayout', 'dark');
      setTimeout(() => {
        Account.$delete(id);

        if (wasDefault && this.accounts.length > 0) {
          Account.$update({
            where: (record) => { return record.id === this.accounts[0].id; },
            data: { default: true },
          });
        }

        const wallets = Wallet.query().where('account_id', id).get();
        wallets.forEach((wallet) => {
          Wallet.$delete(wallet.id);
        });

        const transactions = Tx.query().where('account_id', id).get();
        transactions.forEach((tx) => {
          Tx.$delete(tx.id);
        });

        const utxos = Utxo.query().where('account_id', id).get();
        utxos.forEach((tx) => {
          Utxo.$delete(tx.id);
        });

        const addresses = Address.query().where('account_id', id).get();
        addresses.forEach((address) => {
          Address.$delete(address.id);
        });

        this.$store.dispatch('settings/setLoading', false);
      }, this.delay.normal);

      return false;
    },
  },
};
</script>

<style>
.over-pinpad-message {
  color: white;
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 1rem;
}
</style>
