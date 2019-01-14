<template>
  <q-layout view="lHh Lpr lFf">
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
};
</script>

<style>

</style>
