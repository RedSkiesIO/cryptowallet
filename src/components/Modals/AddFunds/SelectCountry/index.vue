<template>
  <div>
    <q-select
      v-model="selectedCountry"
      :options="countries"
      label="Select your country"
      behaviour="dialog"
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
import axios from 'axios';

export default {
  name: 'SelectCountry',

  data() {
    return {
      countryList: null,
      selectedCountry: null,
    };
  },

  computed: {

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

  async created() {
    this.countryList = (await axios.get('https://api.transak.com/api/v1/countries/list')).data.response;
  },
};
</script>

<style>

</style>
