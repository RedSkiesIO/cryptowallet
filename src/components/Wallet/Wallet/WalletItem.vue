<template>
  <div
    class="coin"
    @click="selectCoin(data.uid)"
  >
    <div class="details">
      <div class="icon"/>
      <div class="name">{{ data.name }}</div>
    </div>
    <div class="balance">
      <div>{{ data.balance }}</div>
      <div>
        <Amount
          :amount="data.balance"
          :prepend-plus-or-minus="false"
          :currency="currency"
          :coin="data.key"
        />
      </div>
    </div>
    <div>
      <q-icon name="chevron_right"/>
    </div>
  </div>
</template>

<script>
import Amount from '@/components/Wallet/SharedComponents/Amount.vue';

export default {
  name: 'WalletItem',
  components: {
    Amount,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
  },
  methods: {
    selectCoin(uid) {
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
