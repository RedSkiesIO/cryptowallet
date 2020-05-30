<template>
  <div>
    <q-dialog
      v-model="addFundsModalOpened"
      persistent
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
      content-class="light-modal"
    >
      <AddFundsContent />
    </q-dialog>
  </div>
</template>

<script>
import AddFundsContent from './TermsContent';

export default {
  name: 'AddFunds',
  components: {
    AddFundsContent,
  },
  computed: {
    addFundsModalOpened: {
      get() {
        return this.$store.state.modals.addFundsModalOpened;
      },
      set(value) {
        this.$store.dispatch('modals/setAddFundsModalOpened', value);
      },
    },
  },
};
</script>

<style>
</style>
