<template>
  <div>
    <div v-if="wallets.length === 0">
      <q-btn
        icon="add_circle_outline"
        label="add"
        color="primary"
        size="xl"
        class="large-cloud-btn"
        @click.prevent="openWalletsModal"
      />
    </div>
    <q-scroll-area
      v-if="wallets.length > 0"
      ref="scrollArea"
      class="scroll-area extended cloud-scroll"
    >
      <div class="scroll-offset" />

      <!-- <CloudListItem
        v-for="wallet in wallets"
        :key="wallet.displayName"
        :wallet="wallet"
        :currency="selectedCurrency"
      /> -->
    </q-scroll-area>
  </div>
</template>

<script>
// import CloudListItem from '@/components/Wallet/CloudListItem';
import { mapState } from 'vuex';
import Wallet from '@/store/wallet/entities/wallet';
import Coin from '@/store/wallet/entities/coin';

export default {
  name: 'CloudList',
  components: {
    // CloudListItem,
  },

  data() {
    return {
      scrollPosition: 0,
    };
  },

  computed: {
    ...mapState({
      authenticatedAccount: (state) => { return state.settings.authenticatedAccount; },
    }),

    selectedCurrency() {
      return this.$store.state.settings.selectedCurrency;
    },
    showTestnets() {
      return this.$store.getters['entities/account/find'](this.authenticatedAccount).showTestnets;
    },

    testnets() {
      const coins = Coin.query()
        .where('testnet', true).get();
      return coins.map(({ network }) => { return network; });
    },

    wallets() {
      const wallets = Wallet.query()
        .where('account_id', this.authenticatedAccount)
        .where('imported', true).get();
      if (!this.showTestnets) {
        return wallets.filter(({ network }) => {
          return !this.testnets.includes(network);
        });
      }
      return wallets;
    },
  },
  activated() {
    if (document.querySelectorAll('.cloud-scroll .scroll')[0]) {
      document.querySelectorAll('.cloud-scroll .scroll')[0].scrollTop = this.scrollPosition;
    }
  },

  methods: {
    openWalletsModal() {
      this.$store.dispatch('modals/setAddWalletModalOpened', true);
    },

    touchStart(event) {
      this.touchStartY = event.touches[0].clientY;
    },

    touchMove(event) {
      if (event.touches[0].clientY <= this.touchStartY) {
        event.stopPropagation();
      }

      if (this.wallets.length === 0 || !this.$refs.scrollArea) { return false; }
      if (this.$refs.scrollArea.$el.childNodes[0].scrollTop !== 0) {
        event.stopPropagation();
      }

      return true;
    },

    scrolled(data) {
      this.scrollPosition = data.position;
      const pixels = 100;
      if (data.position > pixels && data.direction === 'down') {
        this.$root.$emit('isHomeBalanceVisible', false);
      }
      if (data.position <= pixels && data.direction === 'up') {
        this.$root.$emit('isHomeBalanceVisible', true);
      }
    },
  },
};
</script>

<style>
.scroll-area {
  position: absolute;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
}

.large-cloud-btn {
  width: 100%;
  height: 3em;
  border-radius: 0.4rem;
  font-size: 3em;
  padding: 0em;
  color: #1e3c57;
  margin-top: 5rem;

}

.large-cloud-btn i {
  color: #1e3c57;
}

.large-cloud-btn .q-btn__content{
  color: #1e3c57;
}

.scroll-offset {
  height: 20rem;
}
</style>
