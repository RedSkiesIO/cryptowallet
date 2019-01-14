<template>
  <div>
    <div v-if="wallet.sdk === 'Bitcoin'">
      <SendBitcoin/>
    </div>

    <div v-if="wallet.sdk === 'Ethereum'">
      <SendEtehreum/>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import SendBitcoin from '@/components/Wallet/SendCoin/SendBitcoin.vue';
import SendEtehreum from '@/components/Wallet/SendCoin/SendEtehreum.vue';

export default {
  name: 'Send',
  components: {
    SendBitcoin,
    SendEtehreum,
  },
  computed: {
    ...mapState({
      id: state => state.route.params.id,
      authenticatedAccount: state => state.settings.authenticatedAccount,
    }),
    wallet() {
      return this.$store.getters['entities/wallet/find'](this.id);
    },
  },
  mounted() {
    console.log(this.wallet);
  },
};

</script>

<style scoped>

</style>
