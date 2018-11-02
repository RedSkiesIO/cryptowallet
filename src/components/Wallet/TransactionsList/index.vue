<template>
  <section
    class="scroll-area"
    @touchmove="prevent"
  >
    <q-scroll-area
      ref="scrollArea"
      class="scroll-area"
    >
      <q-infinite-scroll
        :handler="loadMore"
        :offset="50"
      >
        <q-timeline
          responsive
          color="secondary"
        >
          <SingleTransaction
            v-for="transaction in filteredPaginated"
            :key="transaction.ts"
            :data="transaction"
          />
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
  },

  data() {
    return {
      page: 1,
      perPage: 10,

    };
  },

  computed: {
    transactions() {
      return this.$store.state.payments.transactions;
    },

    /**
     * Filters transactions array from all/sent/received
     * @return {Array}
     */
    filtered() {
      return this.transactions.filter((transaction) => {
        if (this.filter === 'sent') return transaction.to;
        if (this.filter === 'received') return transaction.from;
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
      return () => new Promise(resolve => setTimeout(() => resolve(), ms));
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

    /**
     * Stops q-pull-to-refresh from firing until TransactionsList reaches
     * the top scroll position
     * @param  {Object} event
     */
    prevent(event) {
      if (this.$refs.scrollArea.$el.childNodes[0].scrollTop > 0) {
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
</style>
