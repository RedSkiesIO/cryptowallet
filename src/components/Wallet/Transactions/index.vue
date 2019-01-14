<template>
  <section class="recent-transactions">
    <q-tabs color="secondary">
      <q-tab
        slot="title"
        :label="$t('all')"
        default
        name="tab-1"
      />
      <q-tab
        slot="title"
        :label="$t('sent')"
        name="tab-2"
      />
      <q-tab
        slot="title"
        :label="$t('received')"
        name="tab-3"
      />
      <q-tab-pane name="tab-1">
        <TransactionsList :wallet="wallet"/>
      </q-tab-pane>
      <q-tab-pane name="tab-2">
        <TransactionsList
          :wallet="wallet"
          filter="sent"
        />
      </q-tab-pane>
      <q-tab-pane name="tab-3">
        <TransactionsList
          :wallet="wallet"
          filter="received"
        />
      </q-tab-pane>
    </q-tabs>
  </section>
</template>

<script>
import TransactionsList from '@/components/Wallet/TransactionsList';

export default {
  name: 'Transactions',
  components: {
    TransactionsList,
  },
  props: {
    wallet: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style>
.recent-payments-scroll-area {
  width: auto;
  height: 100%;
}

.recent-transactions {
  height: calc(100vh - 23vh - 5rem - 2.5rem);
  border-top: 2px solid #09233a;
  position: relative;
  background: #16324a;
}

.scroll-content {
  overflow: hidden;
  padding: 0 1rem;
}

.q-tabs {
  height: 100%;
  display: flex;
}

.q-tabs-panes {
  flex: 1;
  display: flex;
}

.q-tab-pane {
  flex: 1;
  font-size: 0.75rem;
}
</style>
