<template>
  <div>
    <q-dialog
      v-model="sendConfirmModalOpened"
      persistent
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
      content-class="light-modal"
    >
      <ConfirmSendContent />
    </q-dialog>
  </div>
</template>

<script>
import ConfirmSendContent from './ConfirmSendContent.vue';

export default {
  name: 'ConfirmSend',
  components: {
    ConfirmSendContent,
  },

  computed: {
    sendConfirmModalOpened: {
      get() {
        return this.$store.state.modals.sendConfirmModalOpened;
      },
      set(value) {
        this.$store.dispatch('modals/setConfirmSendModalOpened', value);
      },
    },
  },

};
</script>

<style scoped>
.small-text {
  font-size: 0.8rem;
}

.sending-spinner-overlay {
  position: absolute;
  height: 100vh;
  width: 100vw;
  z-index: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.9);
  opacity: 0;
  transition: all ease-in-out 250ms;
}

.sending-spinner-overlay.active{
  opacity: 1;
  z-index: 2;
}

.break {
  word-break: break-all;
}
</style>
