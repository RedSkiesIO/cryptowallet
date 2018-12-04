<template>
  <div>
    <div class="new-wallet-btn-wrapper">
      <q-btn
        :label="$t('addWallet')"
        icon="library_add"
        color="primary"
        @click="addWallet"
      />
    </div>

    <q-modal
      v-model="addWalletModalOpened"
      class="dark-modal"
    >
      <div class="close-button-wrapper">
        <q-btn
          :label="$t('close')"
          color="secondary"
          size="sm"
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
  methods: {
    addWallet() {
      this.addWalletModalOpened = true;
    },
  },
};
</script>

<style lang="scss">
.new-wallet-btn-wrapper {
  padding: 1rem;
  display: flex;
  justify-content: center;
  box-shadow: 0px 0px 11px 0px rgba(0, 0, 0, 0.5);
  background: #2c5070;
  position: relative;
}

.close-button-wrapper {
  padding: 0.5rem;
  height: 2.7rem;
}

.dark-modal {
  .modal-content {
    background: #1e3c57;
  }
}

.modal-layout-wrapper {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 2.7rem);
  position: relative;
  color: white;
}

</style>
