<template>
  <q-dialog
    v-model="open"
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
        {{ $t('catalystNode') }}
      </h1>
    </div>

    <div class="modal-layout-wrapper">
      <div class="ip-input">
        <q-input
          v-model="newNodeIp"
          :float-label="$t('IPAddress')"
          outlined
          dark
          color="primary"
        />
      </div>

      <div class="btns-wrapper">
        <q-btn
          :disabled="!ip"
          :label="$t('update')"
          color="primary"
          text-color="blueish"
          @click="updateNode()"
        />
      </div>
    </div>
  </q-dialog>
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
      authenticatedAccount: (state) => { return state.settings.authenticatedAccount; },
      delay: (state) => { return state.settings.delay; },
    }),
    newNodeIp: {
      get() {
        if (this.ip) {
          return this.ip;
        }
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
          where: (record) => { return record.id === this.authenticatedAccount; },
          data: { node: this.ip },
        });
        this.$toast.create(0, this.$t('nodeUpdated'), this.delay.short);
      } else {
        this.$toast.create(10, this.$t('notValidIpAddress'), this.delay.normal);
      }
    },
  },
};
</script>

<style>

</style>
