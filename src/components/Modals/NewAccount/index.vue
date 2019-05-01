<template>
  <div>
    <q-dialog
      v-model="newAccountModalOpened"
      persistent
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
      content-class="dark-modal"
    >
      <NewAccountContent />
    </q-dialog>
  </div>
</template>

<script>
import NewAccountContent from './NewAccountContent.vue';

export default {
  name: 'NewAccount',
  components: {
    NewAccountContent,
  },
  computed: {
    newAccountModalOpened: {
      get() {
        return this.$store.state.modals.newAccountModalOpened;
      },
      set(value) {
        this.$store.dispatch('modals/setNewAccountModalOpened', value);
      },
    },
  },
};
</script>

<style>

</style>
