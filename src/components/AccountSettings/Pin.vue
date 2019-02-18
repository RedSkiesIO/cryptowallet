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
      <h1 class="header-h1">PIN Code</h1>
    </div>

    <div class="modal-layout-wrapper center">
      <h1 class="setup with-margin">
        <span v-if="!authorized">{{ $t('enterPin') }}</span>
        <span v-if="authorized && !newPinConfirmed">{{ $t('enterNewPin') }}</span>
        <span v-if="authorized && newPinConfirmed">{{ $t('repeatNewPin') }}</span>
      </h1>

      <PinPad
        ref="PinPad"
        :mode="mode"
        @inputPin="pinInputListener"
        @attemptUnlock="attemptUnlock"
        @resetPin="resetPin"
        @newPinSet="storeNewPin"
        @attemptConfirm="updateAccount"
      />
    </div>

  </q-modal>
</template>

<script>
import { mapState } from 'vuex';
import Account from '@/store/wallet/entities/account';
import PinPad from '@/components/Auth/PinPad';
import bcrypt from 'bcryptjs';

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
      authorized: false,
      newPinConfirmed: false,
      newPinHash: null,
      salt: null,
      mode: 'access',
    };
  },
  computed: {
    ...mapState({
      authenticatedAccount: (state) => { return state.settings.authenticatedAccount; },
    }),
    account() {
      return this.$store.getters['entities/account/find'](this.authenticatedAccount);
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
        this.mode = 'new-pin';
      } else {
        this.$toast.create(10, this.$t('wrongPin'), 500, 'top');
      }
    },
    /**
     * Closes the modal and resets the state
     */
    closeModal() {
      this.authorized = false;
      this.$refs.PinPad.resetState();
      this.resetPin();
      Object.assign(this.$data, this.$options.data.apply(this));
      this.$emit('closePinModal');
    },

    /**
     * Gets the salt
     * @return {String}
     */
    getSalt() {
      if (this.salt) return this.salt;
      this.salt = bcrypt.genSaltSync(10);
      return this.salt;
    },

    /**
     * Authorizes users current PIN
     */
    authorizeUser() {
      if (this.$CWCrypto.bcryptCompareString(this.pin, this.pinHash) === true) {
        this.authorized = true;
        this.$refs.PinPad.resetState();
        this.resetPin();
        this.mode = 'new-pin';
      } else {
        this.$toast.create(10, this.$t('wrongPin'), 500);
      }
      return false;
    },

    /**
     * Generates new PIN hash
     */
    storeNewPin() {
      this.newPinHash = this.$CWCrypto.bcryptHashString(this.pin.join(''), this.getSalt());
      this.newPinConfirmed = true;
      this.$refs.PinPad.resetState();
      this.resetPin();
      this.mode = 'confirm-new-pin';
      return false;
    },

    /**
     * If new PIN confirmed correctly updates the account
     */
    updateAccount() {
      if (this.$CWCrypto.bcryptCompareString(this.pin.join(''), this.newPinHash)) {
        this.$toast.create(0, this.$t('pinChanged'), 200);
        Account.$update({
          where: (record) => { return record.id === this.authenticatedAccount; },
          data: { pinHash: this.newPinHash },
        });
        this.$refs.PinPad.resetState();
        this.resetPin();
        this.closeModal();
      } else {
        this.$toast.create(10, this.$t('wrongPin'), 500, 'top');
      }
    },
  },
};
</script>

<style>
.setup.with-margin {
  margin: 2rem auto;
  margin-bottom: 1rem;
}
</style>
