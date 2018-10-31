<template>
  <section class="scroll-area">
    <q-scroll-area
      class="scroll-area"
    >
      <WalletItem
        v-for="coin in coins"
        :key="coin.name"
        :data="coin"
        :currency="currency"
      />
    </q-scroll-area>
  </section>
</template>

<script>
import WalletItem from './WalletItem.vue';

export default {
  name: 'WalletsList',
  components: {
    WalletItem,
  },
  props: {
    coins: {
      type: Object,
      required: true,
    },
    currency: {
      type: String,
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
