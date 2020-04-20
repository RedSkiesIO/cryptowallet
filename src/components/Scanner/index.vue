<template>
  <div>
    <video
      id="video"
      class="camera"
    />
    <div
      v-if="!loading"
      class="target-wrapper"
    >
      <div class="target" />
      <div
        class="controls-box"
      >
        <q-btn
          :label="$t('cancel')"
          color="blueish"
          size="md"
          @click="cancel()"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Scanner',
  data() {
    return {
      loading: true,
    };
  },
  mounted() {
    const wait = 1500;
    setTimeout(() => {
      this.loading = false;
    }, wait);
  },
  methods: {
    cancel() {
      this.$store.dispatch('qrcode/cancelScanning');
    },
  },
};
</script>

<style scoped>

.camera {
  object-fit: fill;
  height: 100vh;
  width: 100%;
  max-width: 600px;
}

.controls-box {
  position: absolute;
  bottom: 2rem;
  display: flex;
}

.target-wrapper {
  position: absolute;
  top: 0;
  height: 100vh;
  width: 100vw;
  max-width: 600px;
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
