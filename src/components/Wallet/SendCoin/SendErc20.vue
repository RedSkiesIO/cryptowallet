<template>
  <div>
    <div class="send-coin-box">
      <div class="send-modal-heading">
        <h3>Recipient</h3>
        <span class="h3-line"/>
      </div>

      <div class="to">
        <q-input
          v-model="address"
          placeholder="address"
          class="sm-input grey-input"
          inverted
        />
        <!-- <q-btn
          :label="$t('paste')"
          color="primary"
          size="sm"
          @click="paste"
        /> -->
        <div
          class="side-content qr-code-wrapper"
          @click="scan"
        >
          <div class="hor-line"/>
          <div class="ver-line"/>
          <img src="~assets/QR.svg">
        </div>
      </div>

      <div class="send-modal-heading">
        <h3>Amount</h3>
        <span class="h3-line"/>
      </div>

      <div class="amount">
        <div class="amount-div-wrapper">
          <q-input
            v-model="amount"
            type="number"
            placeholder="0"
            class="sm-input grey-input"
            inverted
          />
          <div class="side-content">{{ coinSymbol }}</div>
        </div>
        <div class="amount-div-wrapper">
          <q-input
            v-model="inCurrency"
            type="number"
            placeholder="0"
            class="sm-input grey-input"
            inverted
          />
          <div class="side-content">{{ selectedCurrency.code }}</div>
        </div>
      </div>

      <div class="send-modal-heading">
        <h3>Fee</h3>
        <span class="h3-line"/>
      </div>

      <div>
        <div class="fee">
          <q-slider
            v-model="feeSetting"
            :label-value="customFeeLabel(feeSetting)"
            :min="0"
            :max="2"
            :step="1"
            color="blueish"
            label-always
            snap
            markers
            @input="getFee"
          />
        </div>
        <div class="estimated-fee">
          Estimated transaction cost: {{ estimatedFee }}
        </div>
      </div>
      <div class="send">
        <q-btn
          :label="$t('send')"
          color="blueish"
          size="md"
          @click="send"
        />
      </div>
    </div>

    <q-modal
      v-model="sendingModalOpened"
      minimized
    >
      <div class="sending-wallet-modal">
        <Spinner/>
        <h1>{{ $t('sending') }}</h1>
      </div>
    </q-modal>
  </div>
</template>

<script>
/* eslint-disable */
import { mapState } from 'vuex';
import AmountFormatter from '@/helpers/AmountFormatter';
import Tx from '@/store/wallet/entities/tx';
import Spinner from '@/components/Spinner';
import Coin from '@/store/wallet/entities/coin';

export default {
  name: 'SendErc20',
  components: {
    Spinner,
  },
  data() {
    return {
      address: '',
      amount: '',
      inCurrency: '',
      sendingModalOpened: false,
      feeSetting: 1,
      estimatedFee: 'N/A',
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
    selectedCurrency() {
      return this.$store.state.settings.selectedCurrency;
    },
    supportedCoins() {
      return Coin.all();
    },
    coinSymbol() {
      return this.supportedCoins.find(coin => coin.name === this.wallet.name).symbol;
    },
    coinDenomination() {
      return this.supportedCoins.find(coin => coin.name === this.wallet.name).denomination;
    },
    latestPrice() {
      const prices = this.$store.getters['entities/latestPrice/find'](`${this.coinSymbol}_${this.selectedCurrency.code}`);
      return prices.data.PRICE;
    },
    parentPrice() {
      const prices = this.$store.getters['entities/latestPrice/find'](`ETH_${this.selectedCurrency.code}`);
      return prices.data.PRICE;
    },
  },
  watch: {
    amount(val) {
      if (val === null || val === '') return false;
      this.amountToCurrency(val);
      return false;
    },
    inCurrency(val) {
      if (val === null || val === '') return false;
      this.currencyToAmount(val);
      return false;
    },
  },

  mounted() {
    this.getFee();
  },

  methods: {
    /**
     * Allows to display a custom fee label on Quasar component
     */
    customFeeLabel(feeSetting) {
      if (feeSetting === 0) return 'small';
      if (feeSetting === 1) return 'recommended';
      return 'high';
    },

    /**
     * Fetches and sets an estimated fee
     */
    async getFee() {
      const coinSDK = this.coinSDKS[this.wallet.parentSdk];
      const fees = await coinSDK.getTransactionFee(this.wallet.network);

      let fee = fees.txMedium;
      if (this.feeSetting === 0) fee = fees.txLow;
      if (this.feeSetting === 2) fee = fees.txHigh;

      // let fee = 0.00021
      // if (this.feeSetting === 0) fee = 0.00004;
      // if (this.feeSetting === 2) fee = 0.0013;

      const formattedFee = new AmountFormatter({
        amount: fee,
        rate: this.parentPrice,
        format: '0.00',
        coin: this.wallet.name,
        currency: this.selectedCurrency,
        toCurrency: true,
        withCurrencySymbol: true,
      });

      this.estimatedFee = formattedFee.getFormatted();
    },

    /**
     * Once transaction was broadcasted successfully
     * resets the state and displays a toast
     */
    completeTransaction() {
      const initialState = this.$options.data.apply(this);
      initialState.amount = '';
      initialState.inCurrency = '';
      initialState.sendingModalOpened = true;
      Object.assign(this.$data, initialState);

      setTimeout(() => {
        this.sendingModalOpened = false;
        this.$toast.create(0, this.$t('madeTransaction'), 200);
      }, 250);
    },

    /**
     * Validates input fields
     * @return {Boolean}
     */
    isValid() {
      if (!this.address) return false;
      if (!this.amount) return false;
      if (!this.inCurrency) return false;
      return true;
    },

    /**
     * Creates and sends a transaction
     */
    async send() {
      if (!this.isValid()) {
        this.$toast.create(10, this.$t('fillAllInputs'), 500);
        return false;
      }

      if (this.wallet.confirmedBalance < this.amount) {
        this.$toast.create(10, this.$t('notEnoughFunds'), 500);
        return false;
      }

      // this.sendingModalOpened = true;
      const coinSDK = this.coinSDKS[this.wallet.sdk];
      const parentSDK = this.coinSDKS[this.wallet.parentSdk];
      const wallet = this.activeWallets[this.authenticatedAccount][this.wallet.name];
      // const keypair = coinSDK.generateKeyPair(wallet, 0);
      // const fees = await parentSDK.getTransactionFee(this.wallet.network);

      // let fee = fees.medium;
      // if (this.feeSetting === 0) fee = fees.low;
      // if (this.feeSetting === 2) fee = fees.high;

      let fee = 0.00021
      if (this.feeSetting === 0) fee = 0.00004;
      if (this.feeSetting === 2) fee = 0.0013;

      const {
        transaction,
        hexTx,
      } = await coinSDK.transfer(wallet, this.address, this.amount, fee);

      console.log('????', transaction);

      this.$root.$emit('confirmSendModalOpened', true, {
        hexTx,
        transaction,
      });


      /*coinSDK.broadcastTx(hexTx, this.wallet.network)
        .then(async (result) => {
          if (!result) {
            console.error('transaction broadcast failure');
            return false;
          }

          transaction.account_id = this.authenticatedAccount;
          transaction.wallet_id = this.wallet.id;
          transaction.isChange = false;
          transaction.sent = true;

          await Tx.$insert({ data: transaction });

          this.completeTransaction();
          return false;
        })
        .catch((err) => {
          alert(err);
          console.log(err);
        });
*/
      return false;
    },

    /**
     * Pastes in the text from the clipboard
     */
    paste() {
      cordova.plugins.clipboard.paste((text) => {
        this.address = text;
      });
    },

    /**
     * Initiates the QR code scanner
     */
    scan() {
      this.$root.$emit('scanQRCode');
      this.$root.$emit('sendCoinModalOpened', false);
      if (typeof QRScanner !== 'undefined') {
        setTimeout(() => {
          QRScanner.scan((err, text) => {
            if (err) {
              // an error occurred, or the scan was canceled (error code `6`)
            } else {
              this.address = text;
              this.$root.$emit('cancelScanning');
              this.$root.$emit('sendCoinModalOpened', true);
            }
          });
        }, 500);
      }
    },
    /**
     * Converts coins to currency as user types
     */
    amountToCurrency(amount) {
      const formattedAmount = new AmountFormatter({
        amount,
        rate: this.latestPrice,
        format: '0.00',
        coin: this.wallet.name,
        prependPlusOrMinus: false,
        currency: this.selectedCurrency,
        toCurrency: true,
      });

      this.inCurrency = formattedAmount.getFormatted();
    },

    /**
     * Converts currency to coin as user types
     */
    currencyToAmount(amount) {
      const formattedAmount = new AmountFormatter({
        amount,
        rate: this.latestPrice,
        format: this.coinDenomination,
        coin: this.wallet.name,
        prependPlusOrMinus: false,
        currency: this.selectedCurrency,
        toCoin: true,
      });

      this.amount = parseFloat(formattedAmount.getFormatted());
    },
  },
};
</script>

<style>

</style>
