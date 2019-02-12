<template>
  <q-layout view="lHh Lpr lFf">
    <div
      v-if="showParticles"
      class="particles"
    >
      <vue-particles
        :particles-number="125"
        :move-speed="2"
        color="#c7c7c7"
      />
    </div>
    <q-layout-header>
      <Header/>
    </q-layout-header>

    <div
      :class="{ 'no-footer': !isMainNavVisible }"
      class="layout-wrapper background"
    >
      <router-view />
    </div>
  </q-layout>
</template>

<script>
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
    showParticles() {
      return this.$route.path === '/setup/0';
    },
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
