<template>
  <q-page class="flex flex-center">
    <h1><span class="title">home</span></h1>
  </q-page>
</template>

<style>

</style>


<script>
import ProfileButton from '../components/ProfileButton.vue';

export default {
  name: 'PageIndex',
  components: {
    ProfileButton,
  },
};
</script>

<style lang='scss'>
  h1 {
    .title {
      color: red;
    }
  }
</style>
