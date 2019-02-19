<template>
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
      <h1 class="header-h1">
        Delete Account
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
        mode="access"
        @inputPin="pinInputListener"
        @attemptUnlock="attemptUnlock"
      />
    </div>
  </q-modal>
</template>

<script>
import { mapState } from 'vuex';
import Account from '@/store/wallet/entities/account';
import Address from '@/store/wallet/entities/address';
import Tx from '@/store/wallet/entities/tx';
import Utxo from '@/store/wallet/entities/utxo';
import PinPad from '@/components/Auth/PinPad';

export default {
  name: 'Pin',
  components: {
    PinPad,
  },
  props: {
    open: {
      type: Boolean,
      required: true,
    },
    pinHash: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      pin: [],
    };
  },
  computed: {
    ...mapState({
      authenticatedAccount: (state) => { return state.settings.authenticatedAccount; },
    }),
    account() {
      return this.$store.getters['entities/account/find'](this.authenticatedAccount);
    },
    accounts() {
      return this.$store.getters['entities/account/query']().get();
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
        this.authorized = true;
        this.$refs.PinPad.resetState();
        this.resetPin();

        this.$q.dialog({
          title: 'Confirm',
          message: `Are you sure you want to delete the account "${this.account.name}"`,
          ok: 'Yes',
          cancel: 'No',
          color: 'blueish',
        }).then(() => {
          this.deleteAccount(this.account.id);
        }).catch(() => {
          this.closeModal();
        });
      }
    },

    /**
     * Closes the modal and resets state
     */
    closeModal() {
      this.$refs.PinPad.resetState();
      this.resetPin();
      Object.assign(this.$data, this.$options.data.apply(this));
      this.$emit('closePinModal');
    },

    deleteAccount(id) {
      this.$store.dispatch('settings/setLoading', true);
      const wasDefault = this.account.default;
      this.$store.dispatch('settings/setSelectedAccount', null);
      this.$store.dispatch('settings/setAuthenticatedAccount', null);

      if (wasDefault && this.accounts.length > 0) {
        Account.$update({
          where: (record) => { return record.id === id; },
          data: { default: true },
        });
      }

      this.closeModal();

      if (this.accounts.length === 0) {
        this.$router.push({ path: '/setup/0' });
      } else {
        this.$router.push({ path: '/' });
      }

      this.$store.dispatch('settings/setLayout', 'dark');

      setTimeout(() => {
        Account.$delete(id);

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
      }, 1000);

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