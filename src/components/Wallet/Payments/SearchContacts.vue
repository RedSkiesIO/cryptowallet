<template>
  <div class="search-contacts">
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
  </div>
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
      isSearchingContacts: state => state.payments.isSearchingContacts,
      searchingContactsQueryString: state => state.payments.searchingContactsQueryString,
    }),
    searchQueryString: {
      get() {
        return this.$store.state.payments.searchingContactsQueryString;
      },
      set(value) {
        this.$store.dispatch('payments/updateSearchContactsQueryString', { value });
      },
    },

  },
  methods: {
    isSearching(value) {
      this.$store.dispatch('payments/updateIsSearchingContacts', { value });
    },
    cancelSearch() {
      this.$store.dispatch('payments/updateIsSearchingContacts', { value: false });
      this.$store.dispatch('payments/updateSearchContactsQueryString', { value: '' });
    },
  },
};
</script>

<style>
  .search-contacts {
    height: 20vh;
    transition: height 250ms ease-in-out;
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

  .search-contacts .flex-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
</style>
