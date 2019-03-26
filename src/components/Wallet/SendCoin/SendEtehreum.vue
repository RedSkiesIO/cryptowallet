<template>
  <div v-if="latestPrice">
    <div class="send-coin-box">
      <div class="send-modal-heading">
        <h3>{{ $t('recipient') }}</h3>
        <span class="h3-line" />
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
          :error="$v.address.$error"
          placeholder="address"
          class="sm-input"
          outlined
          dense
          color="primary"
          @blur="checkField('address')"
          @input="checkField('address')"
        />
        <div
          class="side-content qr-code-wrapper"
          @click="scan"
        >
          <div class="hor-line" />
          <div class="ver-line" />
          <img src="~assets/QR.svg">
        </div>
      </div>
      <span class="error-label">{{ addressError }}</span>
      <div class="send-modal-heading">
        <h3>{{ $t('amount') }}</h3>
        <span class="h3-line" />
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
            :error="$v.inCoin.$error"
            :disable="maxed"
            type="number"
            placeholder="0"
            class="sm-input"
            outlined
            dense
            color="primary"
            @focus="updateInCoinFocus(true)"
            @blur="updateInCoinFocus(false)"
            @input="validateInput('inCoin')"
          />
          <div class="side-content">
            {{ coinSymbol }}
          </div>
        </div>
        <div class="amount-div-wrapper">
          <q-input
            v-model="inCurrency"
            :error="$v.inCoin.$error"
            :disable="maxed"
            type="number"
            placeholder="0"
            class="sm-input"
            outlined
            dense
            color="primary"
            @focus="updateInCurrencyFocus(true)"
            @blur="updateInCurrencyFocus(false)"
            @input="validateInput('inCoin')"
          />
          <div class="side-content">
            {{ selectedCurrency.code }}
          </div>
        </div>
      </div>
      <span class="error-label">{{ amountError }}</span>
      <div class="send-modal-heading">
        <h3>
          Fee
          <q-icon
            name="help_outline"
            size="1.1rem"
            class="help-icon"
            @click="feeDialogOpened = true"
          />
        </h3>
        <FeeDialog
          :opened="feeDialogOpened"
          :message="$t('helpFeesEtheruem')"
          @closeFeeDialog="feeDialogOpened = false"
        />
        <span class="h3-line" />
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
          {{ $t('estimatedTransaction') }} {{ estimatedFee }}
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
  </div>
</template>

<script>
import {
  required,
  alphaNum,
  between,
} from 'vuelidate/lib/validators';
import {
  AmountFormatter,
  getBalance,
} from '@/helpers';
import { mapState } from 'vuex';
import Coin from '@/store/wallet/entities/coin';
import FeeDialog from '@/components/Wallet/SendCoin/FeeDialog';

export default {
  name: 'SendEthereum',
  components: {
    FeeDialog,
  },
  data() {
    return {
      address: '',
      inCoin: '',
      inCurrency: '',
      inCurrencyFocus: false,
      sendingModalOpened: false,
      feeSetting: 1,
      rawFee: 0,
      feeData: null,
      estimatedFee: 'N/A',
      maxed: false,
      maxValueCoin: Infinity,
      maxValueCurrency: Infinity,
      addressError: '',
      amountError: '',
      feeDialogOpened: false,
      weiMultiplier: 1000000000000000000,
      addressLength: 42,
    };
  },

  validations() {
    return {
      address: {
        required,
        alphaNum,
        between: (value) => {
          return value.length <= this.addressLength && value.length >= this.addressLength;
        },
        isValidAddress: (value) => { return this.validateAddress(value); },
      },
      inCoin: {
        required,
        between: between(0, this.maxValueCoin),
      },
      inCurrency: {
        required,
        between: between(0, this.maxValueCurrency),
      },
    };
  },

  computed: {
    ...mapState({
      id: (state) => {
        return state.route.params.id;
      },
      authenticatedAccount: (state) => {
        return state.settings.authenticatedAccount;
      },
      delay: (state) => { return state.settings.delay; },
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
      return this.supportedCoins.find((coin) => {
        return coin.name === this.wallet.name;
      }).symbol;
    },

    coinDenomination() {
      return this.supportedCoins.find((coin) => {
        return coin.name === this.wallet.name;
      }).denomination;
    },

    latestPrice() {
      const prices = this.$store.getters['entities/latestPrice/find'](`${this.coinSymbol}_${this.selectedCurrency.code}`);
      if (!prices) {
        return null;
      }
      return prices.data.PRICE;
    },
  },

  watch: {
    inCoin(val) {
      if (val === null || val === '') {
        this.inCurrency = '';
        this.validateInput('inCoin');
        return false;
      }
      if (!this.inCurrencyFocus) {
        this.inCurrency = this.amountToCurrency(val);
      }
      this.validateInput('inCoin');
      return false;
    },

    inCurrency(val) {
      if (val === null || val === '') {
        return false;
      }
      if (!this.inCoinFocus && !this.maxed) {
        this.inCoin = this.currencyToCoin(val);
      }
      return false;
    },
  },

  async mounted() {
    await this.getFee();
    this.maxValueCoin = this.getMaxAmount();
    this.maxValueCurrency = this.amountToCurrency(this.maxValueCoin);

    /* eslint-disable-next-line */
    app.$root.$on(`scanned_${this.wallet.name}`, (text) => {
      this.address = text;
    });
  },

  methods: {
    validateAddress(address) {
      const coinSDK = this.coinSDKS[this.wallet.sdk];
      return coinSDK.validateAddress(address, this.wallet.network);
    },
    updateInCoinFocus(val) {
      if (!val) {
        this.validateInput('inCoin');
      }
      this.inCoinFocus = val;
    },
    updateInCurrencyFocus(val) {
      if (!val) {
        this.validateInput('inCoin');
      }
      this.inCurrencyFocus = val;
    },

    validateInput(field) {
      this.checkField(field);
    },
    async checkField(field) {
      if (field === 'address') {
        this.$v.address.$touch();

        if (!this.$v.address.between) {
          this.addressError = this.$t('ethereumAddressInvalidLength');
          return false;
        }

        if (!this.$v.address.isValidAddress) {
          this.addressError = this.$t('ethereumAddressInvalid');
          return false;
        }

        this.addressError = '';
      }

      if (field === 'inCoin') {
        this.$v.inCoin.$touch();
        this.$v.inCurrency.$touch();

        if (!this.$v.inCoin.between) {
          this.amountError = this.$t('notEnoughFunds');
        } else {
          this.amountError = '';
        }

        if (!this.$v.inCoin.$model) {
          this.amountError = this.$t('noAmount');
        }
      }
      return true;
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

      return formattedAmount.getFormatted();
    },

    /**
     * Converts currency to coin as user types
     */
    currencyToCoin(amount) {
      const formattedAmount = new AmountFormatter({
        amount,
        rate: this.latestPrice,
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
      if (feeSetting === 0) {
        return this.$t('lowFeeLabel');
      }

      if (feeSetting === 1) {
        return this.$t('mediumFeeLabel');
      }

      return this.$t('highFeeLabel');
    },

    async feeChange() {
      this.getFee();
      if (this.maxed) {
        this.updateMax();
      }
    },

    /**
     * Fetches and sets an estimated fee
     */
    async getFee() {
      const gasLimit = 21000;
      const response = await this.backEndService.getTransactionFee(this.wallet.symbol);
      const { data } = response.data;

      const gweiToWei = 10000;

      const fees = {
        low: data.low,
        medium: data.medium,
        high: data.high,
        txLow: (data.low * gweiToWei) / this.weiMultiplier,
        txMedium: (data.medium * gweiToWei) / this.weiMultiplier,
        txHigh: (data.high * gweiToWei) / this.weiMultiplier,
      };

      let fee = fees.txMedium;
      if (this.feeSetting === 0) {
        fee = fees.txLow;
      }

      if (this.feeSetting === 2) {
        fee = fees.txHigh;
      }

      let rawFee = fees.medium;
      if (this.feeSetting === 0) {
        rawFee = fees.low;
      }

      if (this.feeSetting === 2) {
        rawFee = fees.high;
      }

      const formattedFee = new AmountFormatter({
        amount: fee,
        rate: this.latestPrice,
        format: '0.00',
        coin: this.wallet.name,
        currency: this.selectedCurrency,
        toCurrency: true,
        withCurrencySymbol: true,
      });

      this.rawFee = rawFee * gasLimit;
      this.feeData = fees;
      this.estimatedFee = formattedFee.getFormatted();
    },

    /**
     * Validates input fields
     * @return {Boolean}
     */
    isInvalid() {
      if (!this.address) { return this.$t('fillAllInputs'); }
      if (!this.inCoin) { return this.$t('fillAllInputs'); }
      if (!this.inCurrency) { return this.$t('fillAllInputs'); }
      if (this.addressError) { return this.addressError; }
      if (this.amountError) { return this.amountError; }

      return false;
    },

    availableBalance() {
      return getBalance(this.wallet, this.authenticatedAccount).available;
    },

    unconfirmedBalance() {
      return getBalance(this.wallet, this.authenticatedAccount).unconfirmed;
    },

    /**
     * Creates and sends a transaction
     */
    async send() {
      if (this.isInvalid()) {
        this.$toast.create(10, this.isInvalid(), this.delay.normal);
        return false;
      }

      const coinSDK = this.coinSDKS[this.wallet.sdk];
      const wallet = this.activeWallets[this.authenticatedAccount][this.wallet.name];
      const keypair = coinSDK.generateKeyPair(wallet, 0);

      let fee = this.feeData.medium;
      if (this.feeSetting === 0) { fee = this.feeData.low; }
      if (this.feeSetting === 2) { fee = this.feeData.high; }

      try {
        const {
          transaction,
          hexTx,
        } = await coinSDK.createEthTx(keypair, this.address, this.inCoin, fee);

        // @todo dont use app global
        /* eslint-disable-next-line */
        app.$root.$emit('confirmSendModalOpened', true, {
          hexTx,
          transaction,
        });
      } catch (err) {
        this.errorHandler(err);
      }

      return false;
    },

    /**
     * Pastes in the text from the clipboard
     */
    paste() {
      try {
        cordova.plugins.clipboard.paste((text) => {
          this.address = text;
        });
      } catch (err) {
        this.errorHandler(err);
      }
    },

    async max() {
      if (this.maxed) {
        this.maxed = false;
        this.inCoin = '';
        this.inCurrency = '';
        this.estimatedFee = 'N/A';
        return false;
      }

      this.maxed = true;
      this.updateMax();
      return false;
    },

    getMaxAmount() {
      return ((this.availableBalance() * this.weiMultiplier) - this.rawFee) / this.weiMultiplier;
    },

    updateMax() {
      this.inCoin = this.getMaxAmount();
    },

    /**
     * Initiates the QR code scanner
     */
    scan() {
      // @todo, don't use app global
      /* eslint-disable-next-line */
      app.$root.$emit('scanQRCode');
      // @todo, don't use app global
      /* eslint-disable-next-line */
      app.$root.$emit('sendCoinModalOpened', false);
      if (typeof QRScanner !== 'undefined') {
        setTimeout(() => {
          QRScanner.scan((err, text) => {
            if (err) {
              this.errorHandler(err);
            } else {
              const coinSDK = this.coinSDKS[this.wallet.sdk];
              const isValid = coinSDK.validateAddress(text, this.wallet.network);

              // @todo, don't use app global
              /* eslint-disable-next-line */
              app.$root.$emit('cancelScanning');
              // @todo, don't use app global
              /* eslint-disable-next-line */
              app.$root.$emit('sendCoinModalOpened', true);

              if (isValid) {
                setTimeout(() => {
                  // @todo, don't use app global
                  /* eslint-disable-next-line */
                  app.$root.$emit(`scanned_${this.wallet.name}`, text);
                }, this.delay.normal);
              }
            }
          });
        }, this.delay.normal);
      }
    },
  },
};
</script>

<style>

</style>
