<template>
  <div>
    <q-modal
      v-model="coinHistoryModalOpened"
      class="dark-modal modal"
    >
      <div class="header-section">
        <div class="header-back-button-wrapper">
          <q-btn
            icon="arrow_back"
            size="lg"
            class="icon-btn back-arrow-btn"
            flat
            @click.prevent="goBack"
          />
        </div>
        <h1 class="header-h1">History</h1>
      </div>
      <div
        v-if="wallet"
        class="modal-layout-wrapper"
      >
        <Transactions :wallet="wallet"/>
      </div>
    </q-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Transactions from '@/components/Wallet/Transactions';

export default {
  name: 'CoinHistory',
  components: {
    Transactions,
  },
  data() {
    return {
      coinHistoryModalOpened: false,
    };
  },
  computed: {
    ...mapState({
      id: state => state.route.params.id,
      authenticatedAccount: state => state.settings.authenticatedAccount,
    }),
    wallet() {
      return this.$store.getters['entities/wallet/find'](this.id);
    },
  },
  watch: {
    $route: {
      handler(to) {
        if (to.name === 'coinHistory') {
          this.coinHistoryModalOpened = true;
        } else {
          this.coinHistoryModalOpened = false;
        }
      },
    },
  },
  mounted() {
    this.$root.$on('coinHistoryModalOpened', (value) => {
      this.coinHistoryModalOpened = value;
    });
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style>
</style>
