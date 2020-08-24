<template>
  <div>
    <div class="header-section">
      <div class="header-back-button-wrapper">
        <q-btn
          icon="arrow_back"
          size="lg"
          color="primary"
          class="icon-btn back-arrow-btn"
          flat
          @click.prevent="goBack"
        />
      </div>
      <h1 class="header-h1">
        {{ $t('addFunds') }}
      </h1>
    </div>

    <div class="modal-layout-wrapper add-funds">
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
          dense
          class="q-gutter-y-md"
        >
          <TransakItem
            v-if="bankTransfer"
            :country="country"
            :bank="true"
            :tokens="transakTokens"
            v-on="$listeners"
          />
          <TransakItem
            v-if="cardPayments"
            :country="country"
            :card="true"
            :tokens="transakTokens"
            v-on="$listeners"
          />
          <RampItem
            v-if="rampAvailable"
            v-on="$listeners"
          />
        </q-list>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import axios from 'axios';
import Coin from '@/store/wallet/entities/coin';
import SelectCountry from './SelectCountry';
import TransakItem from './TransakItem';
import RampItem from './RampItem';

export default {
  name: 'AddFunds',
  components: {
    SelectCountry,
    TransakItem,
    RampItem,
  },
  data() {
    return {
      country: null,
      transakTokens: null,
    };
  },
  computed: {
    ...mapState({
      id: (state) => { return parseInt(state.route.params.id, 10); },
    }),
    wallet() {
      return this.$store.getters['entities/wallet/find'](this.id);
    },
    supportsRamp() {
      if (this.wallet) {
        return Coin.findToken(this.wallet.name).rampNetwork;
      }
      return true;
    },
    partners() {
      if (this.country) {
        return this.country.value.partners;
      }
      return null;
    },
    rampAvailable() {
      if (this.country?.label === 'United Kingdom' && this.supportsRamp) {
        return true;
      }
      return false;
    },

    bankTransfer() {
      if (this.country && this.transakTokens) {
        return this.partners
          .some((partner) => { return (!partner.isCardPayment); });
      }
      return false;
    },

    cardPayments() {
      if (this.country && this.transakTokens) {
        return this.partners
          .some((partner) => { return (!!partner.isCardPayment); });
      }
      return false;
    },
  },

  async mounted() {
    console.log(navigator.language);
    this.transakTokens = (await axios.get('https://api.transak.com/api/v1/currencies/list')).data.response.cryptocurrencies
      .filter((token) => { return token.network === 'erc20'; })
      .map((token) => { return token.symbol; }).join();
  },

  methods: {
    goBack() {
      this.$router.go(-1);
    },
  },
};


</script>

<style>

.add-funds .q-chip {
  margin: 0 0.2rem;
  padding: 0.5rem 0.4rem;
}
.checkbox-wrapper {
  margin-top: 2rem;
  padding: 1rem;
  background: whitesmoke;
  border-radius: 0.3rem;
}

.checkbox-wrapper .q-checkbox__label {
  opacity: 1;
  font-family: Inter-Medium;
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
