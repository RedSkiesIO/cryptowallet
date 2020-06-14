<template>
  <div>
    <q-item
      clickable
      @click="openRamp"
    >
      <q-item-section avatar>
        <img
          class="payment-logo"
          src="@/statics/payment-logos/ramp.svg"
        >
      </q-item-section>
      <q-item-section class="text-weight-bold">
        <span> Use your Bank Account </span>
        <q-item-label
          caption
        >
          Fee 2.5%
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
import { ramp } from '@/helpers/Ramp';
import Payments from '@/store/wallet/entities/payments';

export default {
  name: 'RampItem',
  data() {
    return {
      ramp: null,
    };
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
  },

  beforeDestroy() {
    this.ramp.unsubscribe('*', () => {});
  },


  methods: {
    openRamp() {
      this.ramp = ramp(this.wallet, true);
      this.ramp.domNodes.overlay.style.zIndex = 998;
      this.$emit('loading', { on: true, logo: 'statics/payment-logos/ramp.svg' });
      setTimeout(() => {
        this.ramp.show();
        this.ramp.on('*', (data) => {
          console.log(data);

          if (data.type === 'WIDGET_CONFIG_DONE') { this.handleWidgetOpen(); }
          if (data.type === 'WIDGET_CLOSE') { this.handleWidgetClose(); }
        // if (data.eventName === 'TRANSAK_ORDER_CREATED') { this.handleOrderCreated(data); }
        // if (data.eventName === 'TRANSAK_ORDER_SUCCESSFUL') { this.handleOrderSuccess(data); }
        });
      }, this.delay.normal);

      // this.$emit('setProvider', this.transak);
    },

    handleWidgetOpen() {
      setTimeout(() => {
        this.$emit('loading', { on: false, logo: null });
      }, this.delay.long);
    },

    handleWidgetClose() {
      console.log(this.ramp);
      this.ramp.unsubscribe('*', () => {});
    },

    handleOrderCreated(order) {
      if (order && order.status) {
        Payments.$insert({
          data: {
            id: order.status.id,
            account_id: this.authenticatedAccount,
            wallet_id: this.id,
            address: this.wallet.externalAddress,
            event: order.eventName,
            status: order.status.status,
            isBuyOrSell: order.status.isBuyOrSell,
            currency: order.status.fiatCurrency,
            fiatAmount: order.status.fiatAmount,
            cryptoAmount: order.status.cryptoAmount,
            conversionPrice: order.status.conversionPrice,
            totalFeeInCrypto: order.status.totalFeeInCrypto,
            totalfeeInFiat: order.status.totalFeeInFiat,
            paymentOption: order.status.paymentOption[0],
            fromAddress: order.status.fromWalletAddress,
            expires: order.status.autoExpiresAt,
          },
        });
      }
    },

    handleOrderSuccess(order) {
      Payments.$update({
        where: (record) => {
          return record.id === order.status.id;
        },
        data: {
          event: order.eventName,
          status: order.status.status,
        },
      });
    },

    // handleOrderFailed(order) {
    //   console.log(order);
    // },
  },
};
</script>

<style lang="scss" scoped>

</style>
