<template>
  <div>
    <q-item
      clickable
      @click="openTransak"
    >
      <q-item-section avatar>
        <img
          class="payment-logo"
          src="@/statics/payment-logos/transak.png"
        >
      </q-item-section>
      <q-item-section class="text-weight-bold">
        <span v-if="bank"> Use your Bank Account </span>
        <span v-else> Use your Credit/Debit Card </span>
        <q-item-label caption>
          Limit £10,000, Fee
        </q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-item-label caption>
          <q-icon
            name="keyboard_arrow_right"
            size="sm"
          />
        </q-item-label>
      </q-item-section>
    </q-item>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { transak } from '@/helpers/Transak';

export default {
  name: 'AddFundsItem',
  props: {
    card: {
      type: Boolean,
      required: false,
      default: false,
    },
    bank: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    ...mapState({
      id: (state) => { return parseInt(state.route.params.id, 10); },
      authenticatedAccount: (state) => { return state.settings.authenticatedAccount; },
      delay: (state) => { return state.settings.delay; },
    }),
    wallet() {
      return this.$store.getters['entities/wallet/find'](this.id);
    },

    transak() {
      if (this.country) {
        return transak(this.wallet, this.country.value, true);
      }
      const country = {
        currencyCode: 'GBP',
        alpha2: 'GB',
      };
      return transak(this.wallet, country, true);
    },
  },

  created() {
    this.transak.on(this.transak.ALL_EVENTS, (data) => {
      console.log(data);
      if (data.eventName === 'TRANSAK_WIDGET_OPEN') { this.handleWidgetOpen(); }
      if (data.eventName === 'TRANSAK_WIDGET_CLOSE') { this.handleWidgetClose(); }
      if (data.eventName === 'TRANSAK_ORDER_SUCCESSFUL') { this.handleOrderSuccess(data); }
    });
  },

  methods: {
    openTransak() {
      this.$emit('loading', true);
      this.$emit('setProvider', this.transak);

      this.transak.init();
    },

    closeTransak() {
      this.transak.close();
    },

    handleWidgetOpen() {
      setTimeout(() => {
        this.$emit('loading', false);
      }, this.delay.long);
    },

    handleWidgetClose() {
      this.transak.isInitialised = false;
    },

    handleOrderSuccess(order) {
      console.log(order);
    },

    handleOrderFailed(order) {
      console.log(order);
    },
  },
};
</script>

<style>

</style>
