<template>
  <q-layout>
    <q-header>
      <Header />
    </q-header>

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
