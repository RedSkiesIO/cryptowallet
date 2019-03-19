<template>
  <section
    class="scroll-area static"
    @touchstart="touchStart"
    @touchmove="touchMove"
  >
    <q-scroll-area
      ref="scrollArea"
      class="scroll-area static"
    >
      <q-infinite-scroll
        :handler="loadMore"
        :offset="50"
      >
        <q-timeline
          responsive
          color="blueish"
        >
          <SingleTransaction
            v-for="transaction in filteredPaginated"
            :key="transaction.ts"
            :data="transaction"
          />

          <div
            v-if="filteredPaginated.length === 0"
            class="no-tx-alert"
          >
            <q-banner class="info bg-primary">
              {{ $t('emptyTransactionHistory') }}
            </q-banner>
          </div>
        </q-timeline>
        <q-spinner-dots
          slot="message"
          :size="40"
        />
      </q-infinite-scroll>
    </q-scroll-area>
  </section>
</template>

<script>
import SingleTransaction from '@/components/Wallet/SingleTransaction';
import Tx from '@/store/wallet/entities/tx';

export default {
  name: 'TransactionsList',

  components: {
    SingleTransaction,
  },

  props: {
    filter: {
      type: String,
      default: '',
    },
    wallet: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      page: 1,
      perPage: 10,
    };
  },
  computed: {
    transactions() {
      const msTos = 1000;
      const txs = Tx.query()
        .where('wallet_id', this.wallet.id)
        .where('isChange', false)
        .get();

      txs.sort((a, b) => {
        if (this.wallet.sdk === 'Ethereum' || this.wallet.sdk === 'ERC20') {
          let b1 = new Date(b.confirmedTime * msTos);
          if (!b.confirmedTime) { b1 = new Date(b.receivedTime.toString() * msTos); }

          let a1 = new Date(a.confirmedTime * msTos);
          if (!a.confirmedTime) { a1 = new Date(a.receivedTime.toString() * msTos); }

          return b1 - a1;
        }

        if (this.wallet.sdk === 'Bitcoin') {
          return new Date(b.receivedTime * msTos) - new Date(a.receivedTime * msTos);
        }

        return 0;
      });

      return txs;
    },

    /**
     * Filters transactions array from all / sent / received
     * @return {Array}
     */
    filtered() {
      return this.transactions.filter((transaction) => {
        if (this.filter === 'sent') { return transaction.sent === true; }
        if (this.filter === 'received') { return transaction.sent === false; }
        return true;
      });
    },

    /**
     * Will slice the filtered transactions array into paginated size
     * @return {Array}
     */

    filteredPaginated() {
      return this.filtered.slice(0, this.page * this.perPage);
    },
  },

  methods: {

    /**
     * add wait to loading tx's
     * @param  {Number} ms Milliseconds to wait
     * @return {Function}
     */
    sleeper(ms) {
      return () => {
        return new Promise((resolve) => {
          return setTimeout(() => {
            return resolve();
          }, ms);
        });
      };
    },

    /**
     * Called by q-infinite-scroll component, will attempt to fetch more data
     * The second argument is a function, if said function is called with true
     * it will stop q-infinite-scroll from calling loadMore()
     * @param  {Number} index Current page, begins with 1
     * @param  {Function} done
     * @return {Boolean} true
     */
    loadMore(index, done) {
      if (this.filteredPaginated.length < this.page * this.perPage) {
        done(true);
        return false;
      }

      return this.sleeper(500)().then(() => {
        this.page = this.page + 1;
        done(false);
      });
    },

    touchStart(event) {
      this.touchStartY = event.touches[0].clientY;
    },

    touchMove(event) {
      if (event.touches[0].clientY <= this.touchStartY) {
        event.stopPropagation();
      }

      if (this.$refs.scrollArea.$el.childNodes[0].scrollTop !== 0) {
        event.stopPropagation();
      }
    },
  },
};
</script>

<style>
.scroll-area {
  height: 100%
}

.scroll-area.static {
  position: static!important;
}

.no-tx-alert {
  padding: 0.5rem;
}

.no-tx-alert .q-alert-content {
  font-size: 0.8rem;
}

.q-tab-panel {
  padding: 0;
}
</style>
