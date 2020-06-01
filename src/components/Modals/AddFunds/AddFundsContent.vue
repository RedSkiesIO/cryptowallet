<template>
  <div>
    <div class="header-section">
      <div class="header-back-button-wrapper">
        <q-btn
          icon="arrow_back"
          size="lg"
          class="icon-btn back-arrow-btn"
          flat
          @click.prevent="goBack"
        />
      </div>
      <h1 class="header-h1">
        {{ $t('buy') }} {{ wallet.symbol }}
      </h1>
    </div>

    <div class="modal-layout-wrapper">
      <div class="text-center text-weight-bold q-pa-sm">
        Select Your Payment Method
      </div>

      <q-list
        padding
        separator
      >
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
            Use your Bank Account
            <q-item-label caption>
              Limit £10,000, Fee 0.25% - 0.5%
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
      </q-list>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { transak } from '@/helpers/Transak';

export default {
  name: 'AddFunds',
  data() {
    return {
      // transak: null,
      visible: false,
    };
  },
  computed: {
    ...mapState({
      id: (state) => { return parseInt(state.route.params.id, 10); },
      authenticatedAccount: (state) => { return state.settings.authenticatedAccount; },
      delay: (state) => { return state.settings.delay; },
    }),

    account() {
      return this.$store.getters['entities/account/find'](this.authenticatedAccount);
    },

    wallet() {
      return this.$store.getters['entities/wallet/find'](this.id);
    },

    transak() {
      return transak(this.wallet, this.account);
    },
  },

  created() {
    this.transak.on(this.transak.ALL_EVENTS, (data) => {
      console.log(data);
      if (data.eventName === 'TRANSAK_WIDGET_OPEN') { this.handleWidgetOpen(); }
      if (data.eventName === 'TRANSAK_WIDGET_CLOSE') { this.handleWidgetClose(); }
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

    goBack() {
      this.$router.go(-1);
    },
  },
};


</script>

<style>
.checkbox-wrapper {
  margin-top: 2rem;
  padding: 1rem;
  background: whitesmoke;
  border-radius: 0.3rem;
}

.checkbox-wrapper .q-checkbox__label {
  opacity: 1;
  font-family: Montserrat-Medium;
  margin-left: 0.8rem;
}

.checkbox-wrapper .q-checkbox-icon {
  font-size: 2rem;
}

.payment-logo {
  width: 6rem;
}

/* .q-inner-loading {
  background: white;
} */
</style>
