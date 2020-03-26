<template>
  <section class="recent-transactions">
    <q-tabs
      v-model="tab"
      color="blueish"
      inverted
    >
      <q-tab
        :label="$t('all')"
        default
        name="all"
      />
      <q-tab
        :label="$t('sent')"
        name="sent"
      />
      <q-tab
        :label="$t('received')"
        name="received"
      />
    </q-tabs>

    <q-tab-panels
      v-model="tab"
      animated
    >
      <q-tab-panel
        dark
        name="all"
      >
        <TransactionsList :wallet="wallet" />
      </q-tab-panel>

      <q-tab-panel name="sent">
        <TransactionsList
          :wallet="wallet"
          filter="sent"
        />
      </q-tab-panel>

      <q-tab-panel name="received">
        <TransactionsList
          :wallet="wallet"
          filter="received"
        />
      </q-tab-panel>
    </q-tab-panels>
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
  data() {
    return {
      tab: 'all',
    };
  },
};
</script>

<style>
.q-tab-panels {
  background: #0a2d3e
}

.q-item__label--caption {
  color: lightgrey;
 }

.recent-payments-scroll-area {
  width: auto;
  height: 100%;
}

.recent-transactions {
  height: 100%;
  position: relative;
}

.recent-transactions .q-tab-panels {
  height: calc(100% - 48px);
  position: relative;
}

.scroll-content {
  overflow: hidden;
  padding: 0 1rem;
}

.q-tabs, .q-tabs__content {
  width: 100%!important;
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
