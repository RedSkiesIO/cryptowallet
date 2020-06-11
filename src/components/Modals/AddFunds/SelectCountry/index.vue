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
            <q-item-label
              class="
              text-blueish"
            >
              {{ scope.opt.label }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>

<script>
import SupportedCountries from '@/store/settings/state/transakSupportedCountries';

export default {
  name: 'SelectCountry',

  data() {
    return {
      selectedCountry: null,
    };
  },

  computed: {

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
    setTimeout(() => {
      this.$emit('selectedCountry', this.selectedCountry);
    // eslint-disable-next-line no-magic-numbers
    }, 1000);
  },
};
</script>

<style>

</style>
