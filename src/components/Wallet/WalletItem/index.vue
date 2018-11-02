<template>
  <div
    class="wallet selectWallet"
    @click="selectWallet(wallet.uid)"
  >
    <div class="details">
      <div class="icon"/>
      <div class="name">{{ wallet.name }}</div>
    </div>
    <div class="balance">
      <div>{{ wallet.balance }}</div>
      <Amount
        :amount="wallet.balance"
        :prepend-plus-or-minus="false"
        :currency="currency"
        :coin="wallet.key"
      />
    </div>
    <div>
      <q-icon name="chevron_right"/>
    </div>
  </div>
</template>

<script>
import Amount from '@/components/Wallet/Amount';

export default {
  name: 'WalletItem',

  components: {
    Amount,
  },

  props: {
    wallet: {
      type: Object,
      required: true,
    },
    currency: {
      type: Object,
      required: true,
    },
  },

  methods: {
    selectWallet(uid) {
      this.$router.push({ path: `/wallet/balance/${uid}` });
    },
  },
};
</script>

<style scoped>
.coin {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #13273a;
}

.coin .details {
  display: flex;
  align-items: center;
}

.icon {
  border-radius:100%;
  background: #41678a;
  width: 2.5rem;
  height: 2.5rem;
  margin-right: 1rem;
}
</style>
