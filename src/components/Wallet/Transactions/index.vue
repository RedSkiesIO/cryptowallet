<template>
  <!-- eslint-disable -->
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

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="all">
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
/* eslint-disable */
import TransactionsList from '@/components/Wallet/TransactionsList';

export default {
  name: 'Transactions',
  data() {
    return {
      tab: 'all',
    };
  },
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

.recent-transactions .q-tab-panels {
  height: 100%;
  position: relative;
}

.scroll-content {
  overflow: hidden;
  padding: 0 1rem;
}

.q-tabs, .q-tabs__content {
  width: 100%!important;
}

/*
.q-tabs {
  height: 100%;
  display: flex;
}

.q-tabs-panes {
  flex: 1;
  display: flex;
  height: calc(100% - 48px);
}

.q-tab-pane {
  flex: 1;
  font-size: 0.7rem;
  padding: 0 0.2rem;
}*/

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
