<template>
  <div>
    <q-modal
      v-model="addWalletModalOpened"
      class="light-modal modal"
    >
      <div class="close-button-wrapper">
        <q-btn
          icon="clear"
          color="primary"
          size="lg"
          class="icon-btn close-btn"
          flat
          @click.prevent="addWalletModalOpened = false"
        />
      </div>

      <div class="modal-layout-wrapper">
        <WalletsList
          :wallets="supportedCoins"
          click-item-action="addWallet"
        />
      </div>
    </q-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import WalletsList from '@/components/Wallet/WalletsList';

export default {
  name: 'AddWallet',
  components: {
    WalletsList,
  },
  data() {
    return {
      addWalletModalOpened: false,
    };
  },
  computed: {
    ...mapState({
      supportedCoins: state => state.settings.supportedCoins,
    }),
  },
  mounted() {
    this.$root.$on('walletsModalOpened', (value) => {
      this.addWalletModalOpened = value;
    });
  },
  methods: {
    addWallet() {
      this.addWalletModalOpened = true;
    },
  },
};
</script>

<style>
.close-btn .q-btn-inner {
  justify-content: flex-start;
}
</style>
