<template>
  <q-dialog
    v-model="rootedNoticeModalOpened"
    persistent
  >
    <q-card>
      <q-card-section>
        <div class="text-h6">
          {{ $t('rootDetected') }}
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        {{ $t('rootDesc') }}
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          v-close-popup
          flat
          label="Proceed Anyway"
          color="negative"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>

export default {
  name: 'RootNotice',
  computed: {
    rootedNoticeModalOpened: {
      get() {
        return this.$store.state.modals.rootedNoticeModalOpened;
      },
      set(value) {
        this.$store.dispatch('modals/setRootedNoticeModalOpened', value);
      },
    },
  },
};
</script>

<style>


</style>
