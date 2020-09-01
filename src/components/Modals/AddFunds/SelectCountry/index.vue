<template>
  <div>
    <q-select
      v-model="selectedCountry"
      :options="countries"
      label="Select your country"
      behaviour="dialog"
      @input="(val) => $emit('selectedCountry', val)"
    >
      <template
        v-if="selectedCountry"
        v-slot:prepend
      >
        <q-avatar>
          <img :src="selectedCountry.flag">
        </q-avatar>
      </template>
      <template v-slot:option="scope">
        <q-item
          v-bind="scope.itemProps"
          class="q-mx-sm"
          v-on="scope.itemEvents"
        >
          <q-item-section avatar>
            <img
              :src="scope.opt.flag"
            >
          </q-item-section>
          <q-item-section>
            <q-item-label>
              {{ scope.opt.label }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Account from '@/store/wallet/entities/Account';
import SupportedCountries from '@/store/settings/state/transakSupportedCountries';

export default {
  name: 'SelectCountry',

  data() {
    return {
      // selectedCountry: null,
    };
  },

  computed: {
    ...mapState({
      authenticatedAccount: (state) => { return state.settings.authenticatedAccount; },
    }),
    account() {
      return this.$store.getters['entities/account/find'](this.authenticatedAccount);
    },
    selectedCountry: {
      get() {
        return this.account.country;
      },
      set(val) {
        Account.$update({
          where: (record) => {
            return record.id === this.authenticatedAccount;
          },
          data: {
            country: val,
          },
        });
      },
    },
    countryList() {
      return SupportedCountries;
    },

    countries() {
      if (this.countryList) {
        return this.countryList.filter(({ isAllowed }) => {
          return isAllowed;
        })
          .map((country) => {
            return {
              label: country.name,
              value: country,
              flag: `https://www.countryflags.io/${country.alpha2}/flat/32.png`,
            };
          });
      }
      return null;
    },
  },

  mounted() {
    // eslint-disable-next-line no-magic-numbers
    const lang = navigator.language.slice(-2).toUpperCase();
    const country = this.countries.find(({ value }) => { return value.alpha2 === lang; });
    if (country) { this.selectedCountry = country; }

    setTimeout(() => {
      this.$emit('selectedCountry', this.selectedCountry);
      // eslint-disable-next-line no-magic-numbers
    }, 1000);
  },
};
</script>

<style>

</style>
