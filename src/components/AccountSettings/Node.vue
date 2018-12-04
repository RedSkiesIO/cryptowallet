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
      <q-input v-model="newNodeIp" />
    </div>

    <div>
      <q-btn
        :disabled="!ip"
        :label="$t('update')"
        color="secondary"
        size="sm"
        @click="updateNode()"
      />
    </div>
  </q-modal>
</template>

<script>
import { mapState } from 'vuex';
import Account from '@/store/wallet/entities/account';

export default {
  name: 'Node',
  props: {
    open: {
      type: Boolean,
      required: true,
    },
    current: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      ip: null,
    };
  },
  computed: {
    ...mapState({
      authenticatedAccount: state => state.settings.authenticatedAccount,
    }),
    newNodeIp: {
      get() {
        return this.current;
      },
      set(ip) {
        this.ip = ip;
      },
    },
  },
  methods: {
    /**
     * Validates IP address
     */
    validIp(ip) {
      if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip)) {
        return true;
      }
      return false;
    },
    closeModal() {
      this.$emit('closeNodeModal');
    },

    /**
     * Updates the account
     */
    updateNode() {
      if (this.validIp(this.ip)) {
        Account.$update({
          where: record => record.id === this.authenticatedAccount,
          data: { node: this.ip },
        });
        this.$toast.create(0, this.$t('nodeUpdated'), 200);
      } else {
        this.$toast.create(10, this.$t('notValidIpAddress'), 500);
      }
    },
  },
};
</script>

<style>

</style>
