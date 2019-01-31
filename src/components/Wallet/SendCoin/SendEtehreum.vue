<template>
  <div>
    <div class="send-coin-box">
      <div class="send-modal-heading">
        <h3>Recipient</h3>
        <span class="h3-line"/>
        <q-btn
          :label="$t('paste')"
          size="sm"
          class="send-heading-btn"
          @click="paste"
        />
      </div>

      <div class="to">
        <q-input
          v-model="address"
          placeholder="address"
          class="sm-input grey-input"
          inverted
        />
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
        <q-btn
          :label="$t('max')"
          :class="{ active: maxed }"
          size="sm"
          class="send-heading-btn"
          @click="max"
        />
      </div>

      <div class="amount">
        <div class="amount-div-wrapper">
          <q-input
            v-model="inCoin"
            :disable="maxed"
            type="number"
            placeholder="0"
            class="sm-input grey-input"
            inverted
            @focus="updateInCoinFocus(true)"
            @blur="updateInCoinFocus(false)"
          />
          <div class="side-content">{{ coinSymbol }}</div>
        </div>
        <div class="amount-div-wrapper">
          <q-input
            v-model="inCurrency"
            :disable="maxed"
            type="number"
            placeholder="0"
            class="sm-input grey-input"
            inverted
            @focus="updateInCurrencyFocus(true)"
            @blur="updateInCurrencyFocus(false)"
          />
          <div class="side-content">{{ selectedCurrency.code }}</div>
        </div>
      </div>

      <div class="send-modal-heading">
        <h3>
          Fee
          <q-icon
            name="help_outline"
            size="1.1rem"
            class="help-icon"
            @click.native="helpFee"
          />
        </h3>
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
            @input="feeChange"
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
  name: 'SendEthereum',
  components: {
    Spinner,
  },
  data() {
    return {
      address: '',
      inCoin: '',
      inCurrency: '',
      inCurrencyFocus: false,
      sendingModalOpened: false,
      sendingModalOpened: false,
      feeSetting: 1,
      rawFee: 0,
      feeData: null,
      estimatedFee: 'N/A',
      maxed: false,
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
  },

  watch: {
    inCoin(val) {
      if (val === null || val === '') return false;
      if (!this.inCurrencyFocus) this.inCurrency = this.amountToCurrency(val);
      return false;
    },
    inCurrency(val) {
      if (val === null || val === '') return false;
      if (!this.inCoinFocus && !this.maxed) this.inCoin = this.currencyToCoin(val);
      return false;
    },
  },

  mounted() {
    this.getFee();
  },

  methods: {
    helpFee() {
      this.$q.dialog({
        title: 'Fees',
        message: this.$t('helpFeesEtheruem'),
        ok: 'OK',
        color: 'blueish',
      });
    },
    updateInCoinFocus(val) {
      this.inCoinFocus = val;
    },
    updateInCurrencyFocus(val) {
      this.inCurrencyFocus = val;
    },
    /**
     * Converts coins to currency as user types
     */
    amountToCurrency(amount) {
      const formattedAmount = new AmountFormatter({
        amount,
        format: '0.00',
        coin: this.wallet.name,
        prependPlusOrMinus: false,
        currency: this.selectedCurrency,
        toCurrency: true,
      });

      return formattedAmount.getFormatted();
    },

    /**
     * Converts currency to coin as user types
     */
    currencyToCoin(amount) {
      const formattedAmount = new AmountFormatter({
        amount,
        format: this.coinDenomination,
        coin: this.wallet.name,
        prependPlusOrMinus: false,
        currency: this.selectedCurrency,
        toCoin: true,
      });

      return parseFloat(formattedAmount.getFormatted());
    },

    /**
     * Allows to display a custom fee label on Quasar component
     */
    customFeeLabel(feeSetting) {
      if (feeSetting === 0) return 'slow';
      if (feeSetting === 1) return 'fast';
      return 'fastest';
    },


    async feeChange() {
      this.getFee();
      if(this.maxed) this.updateMax();
    },

    /**
     * Fetches and sets an estimated fee
     */
    async getFee() {
      const coinSDK = this.coinSDKS[this.wallet.sdk];
      const fees = await coinSDK.getTransactionFee(this.wallet.network);

      let fee = fees.txMedium;
      if (this.feeSetting === 0) fee = fees.txLow;
      if (this.feeSetting === 2) fee = fees.txHigh;
      console.log('fee :', fee);



      let rawFee = fees.medium;
      if (this.feeSetting === 0) rawFee = fees.low;
      if (this.feeSetting === 2) rawFee = fees.high;

      const formattedFee = new AmountFormatter({
        amount: fee,
        rate: this.latestPrice,
        format: '0.00',
        coin: this.wallet.name,
        currency: this.selectedCurrency,
        toCurrency: true,
        withCurrencySymbol: true,
      });


      this.rawFee = rawFee * 21000;
      this.feeData = fees;
      this.estimatedFee = formattedFee.getFormatted();
    },

    /**
     * Validates input fields
     * @return {Boolean}
     */
    isValid() {
      if (!this.address) return false;
      if (!this.inCoin) return false;
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

      if (this.wallet.confirmedBalance < this.inCoin) {
        this.$toast.create(10, this.$t('notEnoughFunds'), 500);
        return false;
      }

      // this.sendingModalOpened = true;
      const coinSDK = this.coinSDKS[this.wallet.sdk];
      const wallet = this.activeWallets[this.authenticatedAccount][this.wallet.name];
      const keypair = coinSDK.generateKeyPair(wallet, 0);

      let fee = this.feeData.medium;
      if (this.feeSetting === 0) fee = this.feeData.low;
      if (this.feeSetting === 2) fee = this.feeData.high;

      const {
        transaction,
        hexTx,
      } = await coinSDK.createEthTx(keypair, this.address, this.inCoin, fee);


      this.$root.$emit('confirmSendModalOpened', true, {
        hexTx,
        transaction,
      });

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

    async max() {
      if (this.maxed) {
        this.maxed = false;
        this.inCoin = '';
        this.inCurrency = '';
        return false;
      }

      this.maxed = true;
      this.updateMax();
    },

    updateMax() {
      this.inCoin = (this.wallet.confirmedBalance * 1000000000000000000 - this.rawFee) / 1000000000000000000;
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
  },
};
</script>

<style>

</style>
