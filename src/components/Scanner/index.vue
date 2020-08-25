<template>
  <div>
    <video
      v-if="isWebScan"
      id="video"
      class="camera"
    />
    <div class="target-wrapper">
      <div class="target" />
      <div class="controls-box">
        <q-btn
          :label="$t('cancel')"
          color="secondary"
          text-color="info"
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
  computed: {
    isWebScan() {
      if (typeof QRScanner !== 'undefined') {
        return false;
      }
      return true;
    },
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
  position: absolute;
  object-fit: fill;
  height: 100%;
  width: 100%;
}

.desktop .camera {
    left: 50%;
    transform: translate(-50%);
    max-width: 600px;
}

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

.desktop .target-wrapper {
    left: 50%;
    transform: translate(-50%);
    max-width: 600px;
}

.target {
  width: 15rem;
  height: 15rem;
  border: 1rem solid rgba(0, 0, 0, 0.3);
  background: none;
}
</style>
