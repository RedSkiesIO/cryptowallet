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
import SingleTransaction from './SingleTransaction.vue';

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
     * Called by q-infinite-scroll component, will attempt to fetch more data
     * The second argument is a function, if said function is called with true
     * it will stop q-infinite-scroll from calling loadMore()
     * @param  {Number} index Current page, begins with 1
     * @param  {Function} done
     * @return {Boolean} true
     */
    async loadMore(index, done) {
      // if you have less data then you could fit on the page
      // it means there is no more data to be loaded
      // call done(true) to prevent subsequent attempts
      if (this.filteredPaginated.length < this.page * this.perPage) {
        done(true);
        return false;
      }

      /**
       * Included to simulate network latency
       * Without it user won't see the loading indicator
       * @param  {Number} ms Milliseconds to wait
       * @return {Function}
       */
      function sleeper(ms) {
        return function (x) {
          return new Promise(resolve => setTimeout(() => resolve(x), ms));
        };
      }

      /**
       * Wait 1500ms and the load the next page
       * await is needed for unit tests to wait for asynchronous code
       */
      await sleeper(500)().then(() => {
        this.page = this.page + 1;
        done(false);
      });

      return true;
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
