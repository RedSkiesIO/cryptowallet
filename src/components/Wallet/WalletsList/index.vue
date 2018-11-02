<template>
  <section class="scroll-area">
    <q-scroll-area
      class="scroll-area"
    >
      <WalletItem
        v-for="wallet in wallets"
        :key="wallet.name"
        :wallet="wallet"
        :currency="currency"
      />
    </q-scroll-area>
  </section>
</template>

<script>
import WalletItem from '@/components/Wallet/WalletItem';

export default {
  name: 'WalletsList',

  components: {
    WalletItem,
  },

  props: {
    wallets: {
      type: Object,
      required: true,
    },

    currency: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.scroll-area {
  position: absolute;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
}
</style>
