<template>
  <section class="scroll-area">
    <h1 v-if="wallets.length === 0">
      {{ $t('noWallets') }}
    </h1>

    <q-scroll-area
      v-if="wallets.length > 0"
      class="scroll-area"
    >
      <WalletItem
        v-for="wallet in wallets"
        :key="wallet.name"
        :wallet="wallet"
        :currency="currency"
        :click-item-action="clickItemAction"
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
      type: Array,
      required: true,
    },

    currency: {
      type: Object,
      required: false,
    },

    clickItemAction: {
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
