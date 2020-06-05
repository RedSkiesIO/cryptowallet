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
      <div>
        <div class="text-center text-weight-bold q-pa-sm">
          <SelectCountry @selectedCountry="(val) => country = val" />
        </div>

        <q-list
          padding
          separator
        >
          <AddFundsItem
            v-if="bankTransfer"
            :country="country"
            :bank="true"
            v-on="$listeners"
          />
          <AddFundsItem
            v-if="cardPayments"
            :country="country"
            :card="true"
            v-on="$listeners"
          />
        </q-list>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
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
      country: null,
    };
  },
  computed: {
    ...mapState({
      id: (state) => { return parseInt(state.route.params.id, 10); },
    }),
    wallet() {
      return this.$store.getters['entities/wallet/find'](this.id);
    },
    partners() {
      if (this.country) {
        return this.country.value.partners;
      }
      return null;
    },
    bankTransfer() {
      if (this.country) {
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

  methods: {
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
