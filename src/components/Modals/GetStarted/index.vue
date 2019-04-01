<template>
  <div>
    <q-dialog
      v-model="getStartedModalOpened"
      persistent
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
  data() {
    return {
      getStartedModalOpened: false,
    };
  },
  mounted() {
    this.$root.$on('getStartedModalOpened', (value) => {
      this.getStartedModalOpened = value;
    });
  },
};
</script>

<style>

</style>
