<template>
  <div>
    <q-dialog
      v-model="sendConfirmModalOpened"
      persistent
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
      content-class="light-modal"
    >
      <div
        :class="{ active: loading }"
        class="sending-spinner-overlay"
      >
        <Spinner />
      </div>

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
        <h1 class="header-h1">
          {{ $t('confirm') }}
        </h1>
      </div>
      <div
        v-if="wallet && txData"
        class="modal-layout-wrapper"
      >
        <CoinHeader :wallet="wallet" />

        <div class="send-modal-heading">
          <h3>{{ $t('to') }}</h3>
          <span class="h3-line" />
        </div>

        <div class="small-text break">
          {{ to }}
        </div>

        <div class="send-modal-heading">
          <h3>{{ $t('amount') }}</h3>
          <span class="h3-line" />
        </div>

        <div class="small-text">
          {{ txData.transaction.value }} {{ coinSymbol }}
          ({{ coinToCurrency(txData.transaction.value) }})
        </div>

        <div class="send-modal-heading">
          <h3>{{ $t('fee') }}</h3>
          <span class="h3-line" />
        </div>

        <div
          v-if="!isErc20"
          class="small-text"
        >
          {{ txData.transaction.fee }} {{ coinSymbol }}
          ({{ coinToCurrency(txData.transaction.fee, true) }})
        </div>
        <div
          v-if="isErc20"
          class="small-text"
        >
          {{ txData.transaction.fee / weiMultiplier }}  {{ $t('ethSymbol') }}
          ({{ coinToCurrency(txData.transaction.fee / weiMultiplier, true) }})
        </div>

        <div class="send-modal-heading">
          <h3>{{ $t('newBalance') }}</h3>
          <span class="h3-line" />
        </div>

        <div class="small-text">
          {{ coinSymbol }}
          ({{ coinToCurrency(newBalance) }})
        </div>

        <div class="send">
          <q-btn
            :label="$t('Confirm')"
            color="blueish"
            size="md"
            @click="confirm"
          />
        </div>
      </div>
    </q-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import CoinHeader from '@/components/Wallet/CoinHeader';
import Spinner from '@/components/Spinner';
import Address from '@/store/wallet/entities/address';
import Wallet from '@/store/wallet/entities/wallet';
import Tx from '@/store/wallet/entities/tx';
import Utxo from '@/store/wallet/entities/utxo';
import Coin from '@/store/wallet/entities/coin';
import {
  AmountFormatter,
  getBalance,
} from '@/helpers';

export default {
  name: 'ConfirmSend',
  components: {
    CoinHeader,
    Spinner,
  },

  data() {
    return {
      loading: false,
      weiMultiplier: 1000000000000000000,
      tinyBalance: 0.00000000001,
    };
  },

  computed: {
    ...mapState({
      id: (state) => { return state.route.params.id; },
      authenticatedAccount: (state) => { return state.settings.authenticatedAccount; },
      delay: (state) => { return state.settings.delay; },
      txData: (state) => { return state.modals.sendConfirmTxData; },
    }),

    sendConfirmModalOpened: {
      get() {
        return this.$store.state.modals.sendConfirmModalOpened;
      },
      set(value) {
        this.$store.dispatch('modals/setConfirmSendModalOpened', value);
      },
    },

    wallet() {
      return this.$store.getters['entities/wallet/find'](this.id);
    },

    supportedCoins() {
      return Coin.all();
    },

    selectedCurrency() {
      return this.$store.state.settings.selectedCurrency;
    },

    coinSymbol() {
      return this.supportedCoins.find((coin) => { return coin.name === this.wallet.name; }).symbol;
    },

    newBalance() {
      const { unconfirmed } = getBalance(this.wallet, this.authenticatedAccount);

      if (this.wallet.sdk === 'Ethereum') {
        let newBalance = (unconfirmed * this.weiMultiplier)
                           - ((this.txData.transaction.value * this.weiMultiplier)
                           + (parseFloat(this.txData.transaction.fee) * this.weiMultiplier));

        if (newBalance < 0) { newBalance = 0; }
        return newBalance / this.weiMultiplier;
      }
      if (this.wallet.sdk === 'ERC20') {
        let newBalance = (unconfirmed * this.weiMultiplier)
                           - (this.txData.transaction.value * this.weiMultiplier);

        if (newBalance < 0) { newBalance = 0; }
        return newBalance / this.weiMultiplier;
      }
      if (this.wallet.sdk === 'Bitcoin') {
        const totalCost = this.txData.transaction.value + parseFloat(this.txData.transaction.fee);
        let newBalance = unconfirmed - totalCost;
        if (newBalance < this.tinyBalance) { newBalance = 0; }
        return newBalance;
      }
      return false;
    },

    to() {
      if (Array.isArray(this.txData.transaction.receiver)) {
        return this.txData.transaction.receiver[0];
      }
      return this.txData.transaction.receiver;
    },

    latestPrice() {
      const prices = this.$store.getters['entities/latestPrice/find'](`${this.coinSymbol}_${this.selectedCurrency.code}`);
      return prices.data.PRICE;
    },

    isErc20() {
      if (this.wallet.sdk === 'ERC20') {
        return true;
      }
      return false;
    },
  },

  methods: {
    async broadcastTx() {
      const {
        hexTx,
        transaction,
        utxo,
        changeAddresses,
      } = this.txData;

      const coinSDK = this.coinSDKS[this.wallet.sdk];
      if (this.wallet.sdk === 'Bitcoin') {
        const result = await coinSDK.broadcastTx(hexTx, this.wallet.network);
        if (!result) {
          throw new Error(this.$t('transactionBroadcastFail'));
        }

        transaction.account_id = this.authenticatedAccount;
        transaction.wallet_id = this.wallet.id;
        transaction.isChange = false;
        transaction.sent = true;

        await Tx.$insert({ data: transaction });

        utxo.forEach((usedUtxo) => {
          const whereUtxo = (record, item) => {
            return (
              record.txid === item.txid
            && record.vout === item.vout
            && record.wallet_id === this.wallet.id
            );
          };

          Utxo.$update({
            where: (record) => {
              return whereUtxo(record, usedUtxo);
            },
            data: {
              pending: true,
            },
          });
        });

        changeAddresses.forEach(async (address, i) => {
          await Address.$insert({
            data: {
              address,
              account_id: this.authenticatedAccount,
              wallet_id: this.wallet.id,
              chain: 'internal',
              index: this.wallet.internalChainAddressIndex + i,
            },
          });
        });

        const newInternalIndex = this.wallet.internalChainAddressIndex + changeAddresses.length;

        Wallet.$update({
          where: (record) => { return record.id === this.wallet.id; },
          data: { internalChainAddressIndex: newInternalIndex },
        });

        this.completeTransaction();
        return false;
      }

      if (this.wallet.sdk === 'Ethereum' || this.wallet.sdk === 'ERC20') {
        const result = await coinSDK.broadcastTx(hexTx, this.wallet.network);
        if (!result) {
          throw new Error(this.$t('transactionBroadcastFail'));
        }

        transaction.account_id = this.authenticatedAccount;
        transaction.wallet_id = this.wallet.id;
        transaction.isChange = false;
        transaction.sent = true;

        await Tx.$insert({ data: transaction });

        this.completeTransaction();
        return false;
      }

      return false;
    },
    coinToCurrency(amount, fee) {
      let formattedAmount = new AmountFormatter({
        amount,
        rate: this.latestPrice,
        format: '0,0[.]00',
        coin: this.wallet.name,
        prependPlusOrMinus: false,
        currency: this.selectedCurrency,
        toCurrency: true,
        withCurrencySymbol: true,
      });

      if (this.wallet.sdk === 'ERC20' && fee) {
        const parentSymbol = this.supportedCoins.find((coin) => {
          return coin.name === this.wallet.parentName;
        }).symbol;

        const parentPrice = this.$store.getters['entities/latestPrice/find'](`${parentSymbol}_${this.selectedCurrency.code}`).data.PRICE;
        formattedAmount = new AmountFormatter({
          amount,
          rate: parentPrice,
          format: '0,0[.]00',
          coin: this.wallet.parentName,
          prependPlusOrMinus: false,
          currency: this.selectedCurrency,
          toCurrency: true,
          withCurrencySymbol: true,
        });
      }

      return formattedAmount.getFormatted();
    },
    goBack() {
      this.sendConfirmModalOpened = false;
    },
    confirm() {
      this.loading = true;
      setTimeout(async () => {
        try {
          await this.broadcastTx();
        } catch (err) {
          // @todo, don't use app global
          /* eslint-disable-next-line */
          app.$root.$emit('sendFailureModalOpened', true);
          this.errorHandler(err);
        }
      }, this.delay.short);
    },
    completeTransaction() {
      // @todo, don't use app global
      /* eslint-disable-next-line */
      app.$root.$emit('sendSuccessModalOpened', true, this.txData);

      setTimeout(() => {
        this.loading = false;
        this.sendConfirmModalOpened = false;
      }, this.delay.short);
    },
  },
};
</script>

<style scoped>
.small-text {
  font-size: 0.8rem;
}

.sending-spinner-overlay {
  position: absolute;
  height: 100vh;
  width: 100vw;
  z-index: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.9);
  opacity: 0;
  transition: all ease-in-out 250ms;
}

.sending-spinner-overlay.active{
  opacity: 1;
  z-index: 2;
}

.break {
  word-break: break-all;
}
</style>
