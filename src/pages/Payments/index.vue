<template>
  <div>
    <SearchContacts key="SearchContacts" />
    <RecentContacts key="RecentContacts" />
    <ContactsList key="ContactsList" />
  </div>
</template>

<script>
import SearchContacts from '@/components/Contacts/SearchContacts';
import RecentContacts from '@/components/Contacts/RecentContacts';
import ContactsList from '@/components/Contacts/ContactsList';

export default {
  name: 'Exchange',
  components: {
    SearchContacts,
    RecentContacts,
    ContactsList,
  },
};

</script>

<style scoped>

</style>
