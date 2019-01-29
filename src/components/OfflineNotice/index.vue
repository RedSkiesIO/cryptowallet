<template>
  <div
    v-if="!online"
    class="bg-offline"
  >
    <q-alert type="negative">
      No Internet connection detected. To use your wallet, please reconnect to the Internet.
    </q-alert>
  </div>
</template>

<script>
import { Network } from '@/helpers';

export default {
  name: 'OfflineNotice',
  data() {
    return {
      online: null,
    };
  },
  mounted() {
    this.network = new Network();
    this.online = this.network.isOnline();

    this.network
      .on('offline', () => {
        this.online = false;
      })
      .on('online', () => {
        this.online = true;
      });

    this.$root.$on('getStartedModalOpened', (value) => {
      this.getStartedModalOpened = value;
    });
  },
};
</script>

<style>
.bg-offline {
  height: 100vh;
  width: 100vw;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  z-index: 2001;
  top: 0;
  left: 0;
}

.bg-offline .q-alert-content {
  font-size: 0.8rem;
}

.bg-offline .q-alert {
  margin-top: 1rem;
  transition: all ease-in-out 150ms;
  opacity: 1;
}

.bg-offline .q-alert {
  max-width: 18rem;
}

</style>
