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
        <TransactionsList/>
      </q-tab-pane>
      <q-tab-pane name="tab-2">
        <TransactionsList filter="sent"/>
      </q-tab-pane>
      <q-tab-pane name="tab-3">
        <TransactionsList filter="received"/>
      </q-tab-pane>
    </q-tabs>
  </section>
</template>

<script>
import TransactionsList from './TransactionsList.vue';

export default {
  name: 'Transactions',
  components: {
    TransactionsList,
  },
};
</script>

<style>
  .recent-payments-scroll-area {
    width: auto;
    height: 100%;
  }

  .recent-transactions {
    height: 55vh;
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
