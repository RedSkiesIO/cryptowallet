<template>
  <div @touchmove="prevent">
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
      v-scroll="scrolled"
      v-if="wallets.length > 0"
      ref="scrollArea"
      class="scroll-area extended"
    >
      <div class="scroll-offset"/>

      <CloudListItem
        v-for="wallet in wallets"
        :key="wallet.displayName"
        :wallet="wallet"
        :currency="selectedCurrency"
      />
      <q-scroll-observable @scroll="scrolled" />
    </q-scroll-area>
  </div>
</template>

<script>
import CloudListItem from '@/components/Wallet/CloudListItem';
import { mapState } from 'vuex';
import Wallet from '@/store/wallet/entities/wallet';

export default {
  name: 'CloudList',
  components: {
    CloudListItem,
  },
  computed: {
    ...mapState({
      authenticatedAccount: state => state.settings.authenticatedAccount,
    }),
    selectedCurrency() {
      return this.$store.state.settings.selectedCurrency;
    },
    wallets() {
      return Wallet.query().where('account_id', this.authenticatedAccount).get();
    },
  },
  methods: {
    openWalletsModal() {
      this.$root.$emit('walletsModalOpened', true);
    },

    prevent(event) {
      if (this.wallets.length === 0 || !this.$refs.scrollArea) return false;
      if (this.$refs.scrollArea.$el.childNodes[0].scrollTop > 0) {
        event.stopPropagation();
      }
      return false;
    },
    /* eslint-disable */
    scrolled(data) {
      if (data.position > 100 && data.direction === 'down') {
        this.$root.$emit('isHomeBalanceVisible', false);
      }
      if (data.position <= 100 && data.direction === 'up') {
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

.scroll-area .scroll {
  padding-bottom: 1rem;
}

.large-cloud-btn {
  width: 100%;
  height: 3em;
  border-radius: 0.4rem;
  font-size: 3em;
  padding: 0em;
  color: #1e3c57;
  margin-top: 0.2em;
}

.large-cloud-btn i {
  color: #1e3c57;
}

.large-cloud-btn .q-btn-inner{
  color: #1e3c57;
}

.scroll-offset {
  height: 5rem;
}
</style>
