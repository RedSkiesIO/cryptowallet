<template>
  <div>
    <div class="layout">
      <div class="list">
        <CloudList/>
      </div>
    </div>
  </div>
</template>

<script>
import CloudList from '@/components/Wallet/CloudList';

export default {
  name: 'Wallet',
  components: {
    CloudList,
  },
};

</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 6rem - 2.5rem - 4rem);
}

.list {
  flex: 1;
  position: relative;
}
</style>
