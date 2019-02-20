<template>
  <section class="search-contacts">
    <div class="flex-wrapper">
      <div class="search-input-wrapper">
        <q-input
          v-model="searchQueryString"
          inverted
          clearable
          float-label="Search contacts"
          color="blueish"
          @focus="isSearching(true)"
          @blur="isSearching(false)"
        />

        <div
          v-show="isSearchingContacts"
          class="cancel-search-wrapper"
        >
          <q-btn
            color="secondary"
            label="Cancel"
            @click="cancelSearch"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'SearchContacts',
  data() {
    return {
    };
  },

  computed: {
    ...mapState({
      isSearchingContacts: (state) => {
        return state.search.isSearchingContacts;
      },
      searchingContactsQueryString: (state) => {
        return state.search.searchingContactsQueryString;
      },
    }),

    searchQueryString: {

      /**
       * Use a computed value getter to keep the input value in sync with the store
       * @return {String}
       */
      get() {
        return this.$store.state.search.searchingContactsQueryString;
      },

      /**
       * Use a computed value setter to update the store if input value changes
       * @param {String} value The new input value
       */
      set(value) {
        this.$store.dispatch('search/updateSearchContactsQueryString', { value });
      },
    },

  },

  methods: {

    /**
     * Updates the store search/isSearchingContacts state
     * @param  {Boolean} value Either is searching or isn't
     * @return {Boolean}
     */
    isSearching(value) {
      this.$store.dispatch('search/updateIsSearchingContacts', { value });
    },

    /**
     * Will be called if user clicks the CANCEL button while searching contacts
     * Will dispatch actions needed to reset the input value and reset the UI state
     */
    cancelSearch() {
      this.$store.dispatch('search/updateIsSearchingContacts', { value: false });
      this.$store.dispatch('search/updateSearchContactsQueryString', { value: '' });
    },
  },
};
</script>

<style>
.search-contacts {
  transition: height 250ms ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 5em;
}

.search-input-wrapper {
  width: 90vw;
  display: flex;
}

.search-input-wrapper > .q-input {
  width: 60%;
  flex-grow: 1;
}

.cancel-search-wrapper > .q-btn {
  margin-left: 1rem;
  height: 100%;
}

.search-input-wrapper .column {
  padding: 0;
}
</style>
