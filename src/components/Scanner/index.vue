<template>
  <div class="target-wrapper">
    <div class="target"/>
    <div class="controls-box">
      <q-btn
        :label="$t('cancel')"
        color="primary"
        size="md"
        @click="cancel()"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Scanner',
  methods: {
    cancel() {
      this.$root.$emit('cancelScanning');
    },
  },
};
</script>

<style scoped>

.controls-box {
  position: absolute;
  bottom: 2rem;
  display: flex;
}

.target-wrapper {
  position: absolute;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
}

.target {
  width: 15rem;
  height: 15rem;
  border: 1rem solid rgba(0, 0, 0, 0.3);
  background: none;
}
</style>
