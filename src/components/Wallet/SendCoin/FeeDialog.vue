<template>
  <q-dialog
    v-model="opened"
  >
    <q-card
      style="width: 300px"
      class="dialog"
    >
      <q-card-section>
        <h2>
          {{ $t('fees') }}
        </h2>
        <p>
          {{ message }}
        </p>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          :label="$t('ok')"
          color="blueish"
          @click="$emit('closeFeeDialog')"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'FeeDialog',
  props: {
    opened: {
      type: Boolean,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },

};
</script>

<style>

</style>
