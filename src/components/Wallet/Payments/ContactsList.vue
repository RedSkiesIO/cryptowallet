<template>
  <section
    :class="{ isSearchingContacts: isSearchingContacts }"
    class="contacts-list"
  >
    <h1 class="section-h1">{{ $t('contacts') }}</h1>
    <div class="flex-scroll-area-wrapper">
      <q-scroll-area class="contacts-list-scroll-area">
        <div class="scroll-content">
          <ContactListItem
            v-for="contact in filteredContacts"
            :key="contact.displayName"
            :contact="contact"
          />
        </div>
      </q-scroll-area>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import ContactListItem from './ContactListItem.vue';

export default {
  name: 'ContactsList',
  components: {
    ContactListItem,
  },
  computed: {
    ...mapState({
      isSearchingContacts: state => state.payments.isSearchingContacts,
      searchingContactsQueryString: state => state.payments.searchingContactsQueryString,
      contacts: state => state.wallet.contacts,
    }),
    filteredContacts() {
      return this.contacts.filter(contact => new RegExp(`^${this.searchingContactsQueryString}`, 'i').test(contact.displayName));
    },
  },
};
</script>

<style scoped>
.section-h1 {
  color: white;
  font-size: 0.9rem;
  font-family: 'Montserrat-Light';
  background: #162f46;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #0a2338;
  letter-spacing: 0.05rem;
  text-transform: uppercase;
}

.flex-scroll-area-wrapper {
  flex: auto;
  flex-grow: 1;
  position: relative;
  overflow: hidden;
  height: 100%;
}

.contacts-list-scroll-area {
  flex-grow: 1;
  width: 100%;
  height: 100%;
  position: absolute;
}

.contacts-list {
  border-top: 2px solid #09233a;
  position: relative;
  background: #16324a;
  display: flex;
  flex-direction: column;
  transition: height 100ms ease-in-out;
}

.contacts-list.isSearchingContacts {
  height: 85vh;
}

.scroll-content {
  overflow: hidden;
  padding: 0 1rem;
}
</style>
