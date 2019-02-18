<template>
  <section
    v-show="!isSearchingContacts"
    class="recent-contacts-list"
  >
    <h1 class="section-h1">{{ $t('recent') }}</h1>
    <div class="flex-scroll-area-wrapper">
      <div class="test">
        <q-scroll-area class="recent-contacts-scroll-area">
          <div class="scroll-content">
            <RecentContactItem
              v-for="contact in recentContacts"
              :key="contact.name"
              :contact="contact"
            />
          </div>
        </q-scroll-area>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import RecentContactItem from './RecentContactItem.vue';

export default {
  name: 'RecentContacts',
  components: {
    RecentContactItem,
  },
  computed: {
    ...mapState({
      isSearchingContacts: (state) => { return state.payments.isSearchingContacts; },
      recentContacts: (state) => { return state.wallet.recentContacts; },
    }),
  },
};
</script>

<style scoped>
.test {
    position: absolute;
    width: 100%;
    height: 100%;
}

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
  flex-grow: 0;
  position: relative;
  height: 100%;
}

.recent-contacts-scroll-area {
  display: flex;
  height: 100%;
}

.recent-contacts-list {
  height: 25vh;
  border-top: 2px solid #09233a;
  position: relative;
  background: #16324a;
  display: flex;
  flex-direction: column;
  transition: height 100ms ease-in-out;
}

.scroll-content {
  padding: 0 1rem;
  display: flex;
  height: 100%;
  align-items: center;
}
</style>
