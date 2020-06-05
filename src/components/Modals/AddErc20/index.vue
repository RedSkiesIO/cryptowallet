<template>
  <div>
    <q-dialog
      v-model="addErc20ModalOpened"
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
      content-class="light-modal"
    >
      <AddErc20Content />
    </q-dialog>
  </div>
</template>

<script>
import AddErc20Content from './AddErc20Content';

export default {
  name: 'AddErc20',
  components: {
    AddErc20Content,
  },
  computed: {
    addErc20ModalOpened: {
      get() {
        return this.$store.state.modals.addErc20ModalOpened;
      },
      set(value) {
        this.$store.dispatch('modals/setAddErc20ModalOpened', value);
      },
    },
  },
};
</script>

<style>
</style>
