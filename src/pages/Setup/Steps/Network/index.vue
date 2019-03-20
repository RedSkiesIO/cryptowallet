<template>
  <div>
    <h1 class="setup">
      {{ $t('seedSetup') }}
    </h1>
    <p class="setup">
      {{ $t('createRecoverySeed') }}
    </p>
    <p class="setup">
      {{ $t('goOffline') }}
    </p>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { Network } from '@/helpers';

export default {
  computed: {
    ...mapState({
      delay: (state) => { return state.settings.delay; },
    }),
  },
  mounted() {
    this.network = new Network();
  },
  methods: {
    validate() {
      if (this.network.isOnline()) {
        this.$toast.create(10, this.$t('disableInternetWarning'), this.delay.normal);
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
