<template>
  <div>
    <SearchContacts key="SearchContacts" />
    <RecentContacts key="RecentContacts" />
    <ContactsList key="ContactsList" />
  </div>
</template>

<script>
import SearchContacts from '../../components/Wallet/Payments/SearchContacts.vue';
import RecentContacts from '../../components/Wallet/Payments/RecentContacts.vue';
import ContactsList from '../../components/Wallet/Payments/ContactsList.vue';

export default {
  name: 'Exchange',
  components: {
    SearchContacts,
    RecentContacts,
    ContactsList,
  },
  data() {
    return {

    };
  },

  beforeCreate() {

  },

  created() {

  },

  beforeMount() {

  },

  mounted() {

  },

  beforeUpdate() {

  },

  updated() {

  },

  beforeDestroy() {

  },

  destroyed() {

  },

  methods: {

  },

};

</script>

<style scoped>
</style>
