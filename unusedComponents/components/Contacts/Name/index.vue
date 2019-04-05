<template>
  <div class="center-me">
    {{ contactData.displayName }}
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Name',
  computed: {
    ...mapState({
      contacts: (state) => { return state.contacts.contacts; },
      id: (state) => { return state.route.params.id; },
    }),
    contactData() {
      return this.contacts.find((contact) => { return String(contact.id) === this.id; });
    },
  },
};
</script>

<style scoped>
  .center-me {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem;
  }
</style>
