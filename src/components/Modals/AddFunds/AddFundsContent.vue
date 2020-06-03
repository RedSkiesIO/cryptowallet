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
      <div class="text-center text-weight-bold q-pa-sm">
        <SelectCountry @selectedCountry="(val) => country = val" />
      </div>

      <q-list
        padding
        separator
      >
        <AddFundsItem
          v-if="bankTransfer"
          :bank="true"
        />
        <AddFundsItem
          v-if="cardPayments"
          :card="true"
        />
      </q-list>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { transak } from '@/helpers/Transak';
// import axios from 'axios';
import SelectCountry from './SelectCountry';
import AddFundsItem from './AddFundsItem';

export default {
  name: 'AddFunds',
  components: {
    SelectCountry,
    AddFundsItem,
  },
  data() {
    return {
      // transak: null,
      country: null,
      visible: false,
      fee: null,
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
      if (this.country) {
        return transak(this.wallet, this.country.value, true);
      }
      const country = {
        currencyCode: 'GBP',
        alpha2: 'GB',
      };
      return transak(this.wallet, country, true);
    },
    partners() {
      if (this.country) {
        return this.country.value.partners;
      }
      return null;
    },
    bankTransfer() {
      if (this.country) {
        console.log(this.partners);
        return this.partners
          .some((partner) => { return (!partner.isCardPayment); });
      }
      return false;
    },

    cardPayments() {
      if (this.country) {
        return this.partners
          .some((partner) => { return (!!partner.isCardPayment); });
      }
      return false;
    },
  },
  watch: {
    async country(val) {
      console.log(val);
      // await this.getFee();
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
    // async getFee() {
    //   if
    //   this.fee = (await axios.get(`https://api.transak.com/api/v1/currencies/price/${this.country.value.currencyCode}/${this.wallet.symbol}?fiatAmount=30000&paymentMethod=${this.country.value.currencyCode}_bank_transfer`)).data.response;
    //   console.log(this.fee);
    // },
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
