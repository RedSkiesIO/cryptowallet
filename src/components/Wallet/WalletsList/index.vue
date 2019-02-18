<template>
  <section class="scroll-area">
    <div v-if="wallets.length === 0">
      <q-btn
        icon="add_circle_outline"
        label="add"
        color="primary"
        size="xl"
        class="large-cloud-btn"
        @click.prevent="openWalletsModal"
      />
    </div>

    <q-scroll-area
      v-if="wallets.length > 0"
      class="scroll-area"
    >
      <WalletItem
        v-for="wallet in wallets"
        :key="wallet.displayName"
        :wallet="wallet"
        :currency="currency"
        :click-item-action="clickItemAction"
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
  props: {
    // wallets: {
    //   type: Array,
    //   required: true,
    // },

    currency: {
      type: Object,
      required: false,
    },

    clickItemAction: {
      type: String,
      required: true,
    },
  },
  computed: {
    wallets() {
      console.log('Coin.all() :', Coin.all());
      return Coin.all();
    },
  },
  methods: {
    openWalletsModal() {
      this.$root.$emit('walletsModalOpened', true);
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

.large-cloud-btn .q-btn-inner{
  color: #1e3c57;
}
</style>
