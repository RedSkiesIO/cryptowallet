<template>
  <div>
    <q-dialog
      v-model="getStartedModalOpened"
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
      content-class="dark-modal"
    >
      <GetStartedModalContent />
    </q-dialog>
  </div>
</template>

<script>
import GetStartedModalContent from './GetStartedModalContent.vue';

export default {
  name: 'GetStarted',
  components: {
    GetStartedModalContent,
  },
  computed: {
    getStartedModalOpened: {
      get() {
        return this.$store.state.setup.getStartedModalOpened;
      },
      set(value) {
        this.$store.dispatch('setup/setGetStartedModalOpened', value);
      },
    },
  },
};
</script>

<style>

</style>
