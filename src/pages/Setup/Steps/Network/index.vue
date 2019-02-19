<template>
  <div>
    <h1 class="setup">
      Seed Setup
    </h1>
    <p class="setup">
      We're going to create a recovery seed for you that can be
      used to restore your wallets.
    </p>
    <p class="setup">
      First we need to go offline, put your phone into airplane mode,
      and make sure all network connections are switched off.
    </p>
  </div>
</template>

<script>
import { Network } from '@/helpers';

export default {
  mounted() {
    this.network = new Network();
  },
  methods: {
    validate() {
      if (this.network.isOnline()) {
        this.$toast.create(10, this.$t('disableInternetWarning'), 500);
        return false;
      }
      return true;
    },
  },
};
</script>

<style scoped>
  p.setup {
    text-align: center;
  }
</style>
