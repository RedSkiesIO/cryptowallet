<template>
  <div>
    <q-dialog
      v-model="selectAccountModalOpened"
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
      content-class="dark-modal"
    >
      <SelectAccountContent />
    </q-dialog>
  </div>
</template>

<script>
import SelectAccountContent from './SelectAccountContent.vue';

export default {
  name: 'SelectAccount',
  components: {
    SelectAccountContent,
  },
  computed: {
    selectAccountModalOpened: {
      get() {
        return this.$store.state.modals.selectAccountModalOpened;
      },
      set(value) {
        this.$store.dispatch('modals/setSelectAccountModalOpened', value);
      },
    },
  },
};
</script>

<style lang='scss'>
.close-button-wrapper {
  padding: 0.5rem;
  height: 2.7rem;
}

.account-item {
  display: flex;
  color: white;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin-bottom: 2px;
}

.default-switch {
  margin-left: auto;
}

.account-settings-button-wrapper {
  padding: 0.5rem;
}

.list-chevron {
  min-height: auto;
  padding: 0;
  padding-left: 2em;
  position: relative;
  right: -0.25em;
}

.list-chevron .q-btn__content {
  justify-content: flex-end;
}
</style>
