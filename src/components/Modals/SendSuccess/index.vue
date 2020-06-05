<template>
  <div>
    <q-dialog
      v-model="sendSuccessModalOpened"
      no-route-dismiss
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
      content-class="dark-modal modal"
    >
      <SendSuccessContent />
    </q-dialog>
  </div>
</template>

<script>
import SendSuccessContent from './SendSuccessContent.vue';

export default {
  name: 'SendSuccess',
  components: {
    SendSuccessContent,
  },
  computed: {
    sendSuccessModalOpened: {
      get() {
        return this.$store.state.modals.sendSuccessModalOpened;
      },
      set(value) {
        this.$store.dispatch('modals/setSendSuccessModalOpened', value);
      },
    },
  },
};
</script>

<style scoped>
</style>
