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
        <span>{{ $t('enterPin') }}</span>
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
    };
  },
  computed: {
    ...mapState({
      authenticatedAccount: state => state.settings.authenticatedAccount,
    }),
    account() {
      return this.$store.getters['entities/account/find'](this.authenticatedAccount);
    },
    accounts() {
      return this.$store.getters['entities/account/query']().get();
    },
  },
  created() {
    this.$root.$on('inputPin', (pinArr) => {
      this.pin = pinArr.join('');
    });
  },
  methods: {
    /**
     * Closes the modal and resets state
     */
    closeModal() {
      this.$refs.PinPad.resetState();
      Object.assign(this.$data, this.$options.data.apply(this));
      this.$emit('closePinModal');
    },
    /**
     * Validates PIN and displays delete confirmation dialog
     */
    confirmPin() {
      if (!this.pin) {
        this.$toast.create(10, this.$t('wrongPin'), 500);
        return false;
      }

      if (this.$CWCrypto.bcryptCompareString(this.pin, this.pinHash) === true) {
        this.$q.dialog({
          title: 'Confirm',
          message: `Are you sure you want to delete the account "${this.account.name}"`,
          ok: 'Yes',
          cancel: 'No',
        }).then(() => {
          this.deleteAccount(this.account.id);
        }).catch(() => {
          this.closeModal();
        });
      }

      return false;
    },
    deleteAccount(id) {
      const wasDefault = this.account.default;
      Account.$delete(id);
      this.$store.dispatch('settings/setSelectedAccount', null);

      if (wasDefault && this.accounts.length > 0) {
        Account.$update({
          where: record => record.id === this.accounts[0].id,
          data: { default: true },
        });
      }

      if (this.accounts.length === 0) {
        this.$router.push({ path: '/setup' });
      } else {
        this.$router.push({ path: '/' });
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
