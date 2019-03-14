<template>
  <q-layout>
    test
  </q-layout>
</template>

<script>
/* eslint-disable */
import Header from '@/layouts/Header';

export default {
  name: 'UnAuthedLayout',
  components: {
    Header,
  },
  data() {
    return {
      isMainNavVisible: false,
    };
  },
  computed: {
    /* showParticles() {
      return this.$route.path === '/setup/0';
    }, */
  },
};
</script>

<style>
.particles {
  position: absolute;
  z-index: 1;
  width: 100vw;
  height: 100vh;
  opacity: 0.3;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

#particles-js {
  height: 100%;
}
</style>
