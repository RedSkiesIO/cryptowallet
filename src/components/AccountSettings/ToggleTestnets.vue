<template>
  <div
    class="settings-row"
    @click.prevent=""
  >
    <div>
      {{ $t('toggleTestnets') }}
    </div>
    <div>
      <q-toggle
        v-model="allowTestnets"
        color="blueish"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ToggleTestnets',
  data() {
    return {
      allowTestnets: true,
    };
  },
};
</script>

<style>

</style>
