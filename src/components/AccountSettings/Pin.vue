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
      <h1 class="over-pinpad-message">
        <span v-if="!authorized">{{ $t('enterPin') }}</span>
        <span v-if="authorized && !newPinConfirmed">{{ $t('enterNewPin') }}</span>
        <span v-if="authorized && newPinConfirmed">{{ $t('repeatNewPin') }}</span>
      </h1>

      <PinPad ref="PinPad"/>

      <q-btn
        :label="$t('confirm')"
        color="secondary"
        size="sm"
        @click="confirmPin()"
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
      pin: null,
      authorized: false,
      newPinConfirmed: false,
      newPinHash: null,
      salt: null,
    };
  },
  computed: {
    ...mapState({
      authenticatedAccount: state => state.settings.authenticatedAccount,
    }),
  },
  created() {
    this.$root.$on('inputPin', (pinArr) => {
      this.pin = pinArr.join('');
    });
  },
  methods: {
    /**
     * Closes the modal and resets the state
     */
    closeModal() {
      this.authorized = false;
      this.$refs.PinPad.resetState();
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
     * Either: authorize account, store new PIN, validate new PIN and update account
     */
    confirmPin() {
      if (!this.pin) {
        this.$toast.create(10, this.$t('wrongPin'), 500);
        return false;
      }

      if (!this.authorized) {
        this.authorizeUser();
        return false;
      }

      if (this.authorized && !this.newPinConfirmed) {
        this.storeNewPin();
        return false;
      }

      if (this.authorized && this.newPinConfirmed) {
        this.updateAccount();
        return false;
      }
      return false;
    },

    /**
     * Authorizes users current PIN
     */
    authorizeUser() {
      if (this.$CWCrypto.bcryptCompareString(this.pin, this.pinHash) === true) {
        this.authorized = true;
        this.$refs.PinPad.resetState();
      } else {
        this.$toast.create(10, this.$t('wrongPin'), 500);
      }
      return false;
    },

    /**
     * Generates new PIN hash
     */
    storeNewPin() {
      this.newPinHash = this.$CWCrypto.bcryptHashString(this.pin, this.getSalt());
      this.newPinConfirmed = true;
      this.$refs.PinPad.resetState();
      return false;
    },

    /**
     * If new PIN confirmed correctly updates the account
     */
    updateAccount() {
      if (this.$CWCrypto.bcryptCompareString(this.pin, this.newPinHash)) {
        this.$toast.create(0, this.$t('pinChanged'), 200);
        Account.$update({
          where: record => record.id === this.authenticatedAccount,
          data: { pinHash: this.newPinHash },
        });
        this.$refs.PinPad.resetState();
        this.closeModal();
      } else {
        this.$toast.create(10, this.$t('pinMatch'), 500);
      }
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
