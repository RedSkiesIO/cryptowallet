<template>
  <div>
    <q-modal
      v-model="confirmSendModalOpened"
      class="light-modal modal"
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
          Confirm
        </h1>
      </div>
      <div
        v-if="wallet && txData"
        class="modal-layout-wrapper"
      >
        <CoinHeader :wallet="wallet" />

        <div class="send-modal-heading">
          <h3>To</h3>
          <span class="h3-line" />
        </div>

        <div class="small-text break">
          {{ to }}
        </div>

        <div class="send-modal-heading">
          <h3>Amount</h3>
          <span class="h3-line" />
        </div>

        <div class="small-text">
          {{ txData.transaction.value }} {{ coinSymbol }}
          ({{ coinToCurrency(txData.transaction.value) }})
        </div>

        <div class="send-modal-heading">
          <h3>Fee</h3>
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
          {{ txData.transaction.fee / 1000000000000000000 }}  ETH
          ({{ coinToCurrency(txData.transaction.fee / 1000000000000000000, true) }})
        </div>

        <div class="send-modal-heading">
          <h3>New Balance</h3>
          <span class="h3-line" />
        </div>

        <div class="small-text">
          {{ newBalance }} {{ coinSymbol }}
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
    </q-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import CoinHeader from '@/components/Wallet/CoinHeader';
import Spinner from '@/components/Spinner';
import { AmountFormatter } from '@/helpers';
import Address from '@/store/wallet/entities/address';
import Wallet from '@/store/wallet/entities/wallet';
import Tx from '@/store/wallet/entities/tx';
import Utxo from '@/store/wallet/entities/utxo';
import Coin from '@/store/wallet/entities/coin';

export default {
  name: 'ConfirmSend',
  components: {
    CoinHeader,
    Spinner,
  },
  data() {
    return {
      confirmSendModalOpened: false,
      txData: null,
      loading: false,
    };
  },
  computed: {
    ...mapState({
      id: (state) => { return state.route.params.id; },
      authenticatedAccount: (state) => { return state.settings.authenticatedAccount; },
    }),
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
      if (this.wallet.sdk === 'Ethereum') {
        // @todo Konrad, explain the mysterious code below
        /* eslint-disable-next-line */
        const newBalance = this.wallet.confirmedBalance * 1000000000000000000 - (this.txData.transaction.value * 1000000000000000000 + parseFloat(this.txData.transaction.fee) * 1000000000000000000);;
        return newBalance / 1000000000000000000;
      }
      if (this.wallet.sdk === 'ERC20') {
        const newBalance = this.wallet.confirmedBalance
        - this.txData.transaction.value;
        return newBalance;
      }
      if (this.wallet.sdk === 'Bitcoin') {
        /* eslint-disable-next-line */
        return this.wallet.confirmedBalance - (this.txData.transaction.value + parseFloat(this.txData.transaction.fee));
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
  mounted() {
    this.$root.$on('confirmSendModalOpened', (value, txData) => {
      this.confirmSendModalOpened = value;
      this.txData = txData;
      console.log('txData :', txData);
      console.log('newBalance :', this.newBalance);
    });
  },
  methods: {
    async broadcastTx() {
      const {
        hexTx,
        transaction,
        utxo,
        changeAddresses,
      } = this.txData;

      // console.log('broadcastTx', transaction);
      const coinSDK = this.coinSDKS[this.wallet.sdk];

      /* console.log("broadcast", hexTx, transaction, utxo, changeAddresses)
      console.log('network', this.wallet.network); */

      if (this.wallet.sdk === 'Bitcoin') {
        const result = await coinSDK.broadcastTx(hexTx, this.wallet.network);
        if (!result) {
          throw new Error('Transaction broadcast failure');
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
            where: (record) => { return whereUtxo(record, usedUtxo); },
            data: { pending: true },
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

      if (this.wallet.sdk === 'Ethereum' || 'ERC20') {
        const result = await coinSDK.broadcastTx(hexTx, this.wallet.network);
        if (!result) {
          throw new Error('Transaction broadcast failure');
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
        // eslint-disable-next-line max-len
        const parentSymbol = this.supportedCoins.find((coin) => { return coin.name === this.wallet.parentName; }).symbol;
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
      this.confirmSendModalOpened = false;
    },
    confirm() {
      this.loading = true;
      setTimeout(() => {
        try {
          this.broadcastTx();
        } catch (err) {
          this.errorHandler(err);
        }
      }, 250);
    },
    completeTransaction() {
      this.$root.$emit('sendSuccessModalOpened', true, this.txData);

      setTimeout(() => {
        this.loading = false;
        this.confirmSendModalOpened = false;
      }, 250);
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
