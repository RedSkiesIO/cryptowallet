<template>
  <div class="new-wallet-btn-wrapper">
    <q-btn
      icon="library_add"
      label="Add Wallet"
      color="primary"
      @click="addWallet"
    />
  </div>
</template>

<script>
export default {
  name: 'AddWallet',
  methods: {
    addWallet() {

    },
  },
};
</script>

<style>
.new-wallet-btn-wrapper {
  padding: 1rem;
  display: flex;
  justify-content: center;
  box-shadow: 0px 0px 11px 0px rgba(0, 0, 0, 0.5);
  background: #2c5070;
  position: relative;
}
</style>
