<template>
  <section class="recent-transactions">
    <q-tabs
      color="blueish"
      inverted
    >
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
  height: 100%;
  position: relative;
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
  font-size: 0.7rem;
  padding: 0 0.2rem;
}

.q-tab-label {
  font-family: Montserrat-SemiBold;
}

.q-tabs-head {
  background: whitesmoke;
}

.q-timeline {
  margin: 0;
}
</style>
