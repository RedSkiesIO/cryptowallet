<template>
  <div>
    <q-dialog
      v-model="termsModalOpened"
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
      content-class="light-modal"
    >
      <TermsContent />
    </q-dialog>
  </div>
</template>

<script>
import TermsContent from './TermsContent';

export default {
  name: 'Terms',
  components: {
    TermsContent,
  },
  computed: {
    termsModalOpened: {
      get() {
        return this.$store.state.modals.termsModalOpened;
      },
      set(value) {
        this.$store.dispatch('modals/setTermsModalOpened', value);
      },
    },
  },
};
</script>

<style>
</style>
