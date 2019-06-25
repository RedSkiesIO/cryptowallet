<template>
  <section class="scroll-area">
    <q-scroll-area
      v-if="wallets.length > 0"
      class="scroll-area"
    >
      <WalletItem
        v-for="wallet in wallets"
        :key="wallet.displayName"
        :wallet="wallet"
      />
    </q-scroll-area>
  </section>
</template>

<script>
import WalletItem from '@/components/Wallet/WalletItem';
import Coin from '@/store/wallet/entities/coin';

export default {
  name: 'WalletsList',
  components: {
    WalletItem,
  },
  computed: {
    wallets() {
      return Coin.all();
    },
  },
};
</script>

<style>
.scroll-area {
  position: absolute;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
}

.large-cloud-btn {
  width: 100%;
  height: 3em;
  border-radius: 0.3em;
  font-size: 3em;
  padding: 0em;
  color: #1e3c57;
}

.large-cloud-btn i {
  color: #1e3c57;
}

.large-cloud-btn .q-btn__content{
  color: #1e3c57;
}
</style>
