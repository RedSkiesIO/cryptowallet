<template>
  <div>
    <div class="send-coin-box">
      <div class="send-modal-heading">
        <h3>Recipient</h3>
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
          placeholder="address"
          class="sm-input grey-input"
          inverted
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

      <div class="send-modal-heading">
        <h3>Amount</h3>
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
            ref="inCoin"
            :disable="maxed"
            v-model="inCoin"
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
        <h3>Fee
          <q-icon
            name="help_outline"
            size="1.1rem"
            class="help-icon"
            @click.native="helpFee"
          />
        </h3>
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
        <div class="estimated-fee">Estimated transaction cost: {{ estimatedFee }}</div>
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
        <Spinner />
        <h1>Sending</h1>
      </div>
    </q-modal>
  </div>
</template>

<script>
/* eslint-disable */
import { mapState } from "vuex";
import { debounce } from "quasar";
import AmountFormatter from "@/helpers/AmountFormatter";
import Address from "@/store/wallet/entities/address";
import Wallet from "@/store/wallet/entities/wallet";
import Tx from "@/store/wallet/entities/tx";
import Utxo from "@/store/wallet/entities/utxo";
import Spinner from "@/components/Spinner";
import Coin from "@/store/wallet/entities/coin";

export default {
  name: "SendCoin",
  components: {
    Spinner
  },
  data () {
    return {
      address: "",
      inCoin: "",
      inCurrency: "",
      inCoinFocus: false,
      inCurrencyFocus: false,
      sendingModalOpened: false,
      feeSetting: 1,
      estimatedFee: "N/A",
      utxos: [],
      maxed: false
    };
  },
  computed: {
    ...mapState({
      id: state => state.route.params.id,
      authenticatedAccount: state => state.settings.authenticatedAccount
    }),
    wallet () {
      return this.$store.getters["entities/wallet/find"](this.id);
    },
    selectedCurrency () {
      return this.$store.state.settings.selectedCurrency;
    },
    supportedCoins () {
      return Coin.all();
    },
    coinSymbol () {
      return this.supportedCoins.find(coin => coin.name === this.wallet.name)
        .symbol;
    },
    coinDenomination () {
      return this.supportedCoins.find(coin => coin.name === this.wallet.name)
        .denomination;
    },
    latestPrice () {
      const prices = this.$store.getters["entities/latestPrice/find"](
        `${this.coinSymbol}_${this.selectedCurrency.code}`
      );
      return prices.data.PRICE;
    }
  },
  watch: {
    inCoin (val) {
      if (val === null || val === "") return false;
      if (!this.inCurrencyFocus) this.inCurrency = this.amountToCurrency(val);
      this.updateFee(this.feeSetting, this);
      return false;
    },
    inCurrency (val) {
      if (val === null || val === "") return false;
      if (!this.inCoinFocus && !this.maxed)
        this.inCoin = this.currencyToCoin(val);
      this.updateFee(this.feeSetting, this);
      return false;
    },
    address (val) {
      console.log('addres: '+val);
    },
    utxos: {
      handler () {
        this.updateFee(this.feeSetting, this);
      }
    }
  },

  mounted () {
    try {
      this.fetchUTXOs();
      console.log('mounted');
    } catch (e) {
      this.errorHandler(e);
    }
  },

  methods: {
    helpFee () {
      this.$q.dialog({
        title: "Fees",
        message: this.$t("helpFeesBitcoin"),
        ok: "OK",
        color: "blueish"
      });
    },
    updateInCoinFocus (val) {
      this.inCoinFocus = val;
    },
    updateInCurrencyFocus (val) {
      this.inCurrencyFocus = val;
    },
    /**
     * Converts coins to currency as user types
     */
    amountToCurrency (amount) {
      const formattedAmount = new AmountFormatter({
        amount,
        rate: this.latestPrice,
        format: "0.00",
        coin: this.wallet.name,
        prependPlusOrMinus: false,
        currency: this.selectedCurrency,
        toCurrency: true
      });

      return formattedAmount.getFormatted();
    },

    /**
     * Converts currency to coin as user types
     */
    currencyToCoin (amount) {
      const formattedAmount = new AmountFormatter({
        amount,
        rate: this.latestPrice,
        format: this.coinDenomination,
        coin: this.wallet.name,
        prependPlusOrMinus: false,
        currency: this.selectedCurrency,
        toCoin: true
      });

      return parseFloat(formattedAmount.getFormatted());
    },
    /**
     * Fetches UTXOs
     */
    fetchUTXOs () {
      const coinSDK = this.coinSDKS[this.wallet.sdk];
      const addressesRaw = this.getAddressesRaw();
      coinSDK.getUTXOs(addressesRaw, this.wallet.network).then(utxos => {
        console.log("mounted, utxos:", utxos);
        this.utxos = utxos;
      });
    },

    /**
     * Allows to display a custom fee label on Quasar component
     */
    customFeeLabel (feeSetting) {
      if (feeSetting === 0) return "low";
      if (feeSetting === 1) return "recommended";
      return "high";
    },

    /**
     * Calls update fee with context passed when user adjusts fee
     */
    feeChange (fee) {
      if (!this.maxed) this.updateFee(fee, this);
      if (this.maxed) this.updateMax();
    },

    /**
     * Creates a raw transaction which will calculate and update the fee
     */
    updateFee: debounce((fee, that) => {
      const { filteredUtxos, pendingCount } = that.filterOutPending(that.utxos);

      const changeAddresses = that.generateChangeAddresses(
        filteredUtxos,
        pendingCount
      );
      const wallet =
        that.activeWallets[that.authenticatedAccount][that.wallet.name];
      const accounts = that.getAccounts();

      let address = that.getAddresses()[0].address;
      if (that.address) address = that.address;
      let amount = that.wallet.confirmedBalance / 2;
      if (that.inCoin) amount = that.inCoin;

      that.createRawTx(
        accounts,
        changeAddresses,
        filteredUtxos,
        wallet,
        address,
        amount
      );
    }, 250),

    /**
     * Returns addresses
     * @return {Array<Object>}
     */
    getAddresses () {
      return Address.query()
        .where("account_id", this.authenticatedAccount)
        .where("wallet_id", this.wallet.id)
        .where("used", false)
        .get();
    },

    /**
     * Returns raw addresses
     * @return {Array<String>}
     */
    getAddressesRaw () {
      const addresses = this.getAddresses();
      const addressesRaw = addresses.map(item => item.address);

      function onlyUnique (value, index, self) {
        return self.indexOf(value) === index;
      }

      return addressesRaw.filter(onlyUnique);
    },

    /**
     * Returns accounts
     * @return {Array<Object>}
     */
    getAccounts () {
      const addresses = this.getAddresses();
      function mapToAccounts (item) {
        return {
          address: item.address,
          index: item.index,
          change: item.chain === "internal"
        };
      }

      return addresses.map(mapToAccounts);
    },

    /**
     * Filters out recently used, pending UTXOs
     * @param  {Array<Object>} utxos
     * @return {Object}
     */
    filterOutPending (utxos) {
      utxos.forEach(utxo => {
        const found = Utxo.query()
          .where("txid", utxo.txid)
          .where("vout", utxo.vout)
          .where("wallet_id", this.wallet.id)
          .get();

        if (found) return false;
        utxo.account_id = this.authenticatedAccount;
        utxo.wallet_id = this.wallet.id;
        Utxo.$insert({ data: utxo });
        return false;
      });

      const pendingUtxos = Utxo.query()
        .where("account_id", this.authenticatedAccount)
        .where("wallet_id", this.wallet.id)
        .where("pending", true)
        .get();

      // filter out the pending UTXOs
      const filteredUtxos = utxos.filter(utxo => {
        const found = pendingUtxos.find(pendingUtxo => {
          if (utxo.txid === pendingUtxo.txid && utxo.vout === pendingUtxo.vout)
            return true;
          return false;
        });

        if (!found) return true;
        return false;
      });

      return {
        filteredUtxos,
        pendingCount: pendingUtxos.length
      };
    },

    /**
     * Generates change addresses
     * @param  {Array<Object>} filteredUtxos
     * @param  {Number} pendingCount
     * @return {Array<String>}
     */
    generateChangeAddresses (filteredUtxos, pendingCount) {
      let quantityToGenerate = 1;
      // if (filteredUtxos.length === 1 && pendingCount === 0) quantityToGenerate = 2;

      const coinSDK = this.coinSDKS[this.wallet.sdk];
      const wallet = this.activeWallets[this.authenticatedAccount][
        this.wallet.name
      ];

      const changeAddresses = [];

      for (let i = 0; i <= quantityToGenerate - 1; i += 1) {
        const nextIndex = this.wallet.internalChainAddressIndex + i;
        const { address } = coinSDK.generateKeyPair(wallet, nextIndex, true);
        changeAddresses.push(address);
      }

      return changeAddresses;
    },

    /**
     * Creates a raw transaction and updates the fee
     * @param  {Array<Object>} accounts
     * @param  {Array<String>} changeAddresses
     * @param  {Array<Object>} filteredUtxos
     * @param  {Object} wallet
     * @param  {String} address
     * @param  {Number} amount
     * @return {Object}
     */
    async createRawTx (
      accounts,
      changeAddresses,
      filteredUtxos,
      wallet,
      address,
      amount
    ) {
      if (!address || !amount) return false;

      const coinSDK = this.coinSDKS[this.wallet.sdk];

      // console.log('getTransactionFee');
    
       let fees;
      try {
        fees = await coinSDK.getTransactionFee(this.wallet.network);
      } catch (e) {
        // this.errorHandler(e);
      } finally {
        fees = {
          low: 3.0,
          medium: 12.0,
          high: 13.78,
        };
      }

    
  
      
        let fee = fees.medium;
        if (this.feeSetting === 0) fee = fees.low;
        if (this.feeSetting === 2) fee = fees.high;
        fee = Math.round(fee);
     
      // let fee = 12.0;
      // if (this.feeSetting === 0) fee = 13.783;
      // if (this.feeSetting === 2) fee = 3.0;
      // fee = Math.round(fee);

      if (this.maxed) amount = 0;
      //fee = fee + ;

      //console.log('fee', fee, amount);

      /*console.log('=====');
      console.log('accounts', accounts);
      console.log('changeAddresses', changeAddresses);
      console.log('filteredUtxos', filteredUtxos);
      console.log('wallet', wallet);
      console.log('address', address);
      console.log('amount', amount);
      console.log('fee rate', fee);
      console.log('maxed', this.maxed);
      console.log('???');
*/

      // console.log('maxed', this.maxed);

      try {
        const { hexTx, transaction, utxo } = await coinSDK.createRawTx(
          accounts,
          changeAddresses,
          filteredUtxos,
          wallet,
          address,
          amount,
          fee,
          this.maxed
        );

        const formattedFee = new AmountFormatter({
          amount: transaction.fee,
          rate: this.latestPrice,
          format: "0.00",
          coin: this.wallet.name,
          currency: this.selectedCurrency,
          toCurrency: true,
          withCurrencySymbol: true
        });

        this.estimatedFee = formattedFee.getFormatted();

        return {
          hexTx,
          transaction,
          utxo
        };
      } catch (err) {
        this.$toast.create(10, err.message, 500);
      }

      return false;
    },

    /**
     * Validates input fields
     * @return {Boolean}
     */
    isValid () {
      if (!this.address) return false;
      if (!this.inCoin) return false;
      if (!this.inCurrency) return false;
      return true;
    },

    /**
     * Creates and sends a transaction
     */
    async send () {
      this.address = 'asd';
      return false

      if (!this.isValid()) {
        this.$toast.create(10, this.$t("fillAllInputs"), 500);
        return false;
      }

      if (this.wallet.confirmedBalance < this.inCoin) {
        this.$toast.create(10, this.$t("notEnoughFunds"), 500);
        return false;
      }

      // this.sendingModalOpened = true;
      const coinSDK = this.coinSDKS[this.wallet.sdk];
      const wallet = this.activeWallets[this.authenticatedAccount][
        this.wallet.name
      ];

      // there are no UTXOs available, wallet is empty
      if (this.utxos.length === 0) {
        this.$toast.create(10, this.$t("noFunds"), 500);
        // this.sendingModalOpened = false;
        return false;
      }

      const { filteredUtxos, pendingCount } = this.filterOutPending(this.utxos);

      // there is enough funds, but UTXOs are pending
      if (filteredUtxos.length === 0) {
        this.$toast.create(10, this.$t("fundsPending"), 500);
        // this.sendingModalOpened = false;
        return false;
      }

      console.log("filteredUtxos", filteredUtxos);

      const changeAddresses = this.generateChangeAddresses(
        filteredUtxos,
        pendingCount
      );
      const accounts = this.getAccounts();

      const { hexTx, transaction, utxo } = await this.createRawTx(
        accounts,
        changeAddresses,
        filteredUtxos,
        wallet,
        this.address,
        this.inCoin
      );

      console.log("hex", hexTx);
      console.log("tx", transaction);
      console.log("used utxo", utxo);
      console.log(this.wallet.network);

      this.$root.$emit("confirmSendModalOpened", true, {
        hexTx,
        transaction,
        changeAddresses,
        utxo
      });

      return false;
    },

    /**
     * Pastes in the text from the clipboard
     */
    paste () {
      cordova.plugins.clipboard.paste(text => {
        this.address = text;
      });
    },

    async max () {
      if (this.maxed) {
        this.maxed = false;
        this.inCoin = "";
        this.inCurrency = "";
        return false;
      }

      this.maxed = true;
      this.updateMax();
    },

    async updateMax () {
      const { filteredUtxos, pendingCount } = this.filterOutPending(this.utxos);

      const changeAddresses = this.generateChangeAddresses(
        filteredUtxos,
        pendingCount
      );
      const wallet = this.activeWallets[this.authenticatedAccount][
        this.wallet.name
      ];
      const accounts = this.getAccounts();
      let address = this.getAddresses()[0].address;
      if (this.address) address = this.address;
      let amount = this.wallet.confirmedBalance;

      const { transaction } = await this.createRawTx(
        accounts,
        changeAddresses,
        filteredUtxos,
        wallet,
        address,
        amount
      );

      const formattedFee = new AmountFormatter({
        amount: transaction.fee,
        rate: this.latestPrice,
        format: "0.00",
        coin: this.wallet.name,
        currency: this.selectedCurrency,
        toCurrency: true,
        withCurrencySymbol: true
      });

      this.estimatedFee = formattedFee.getFormatted();
      this.inCoin = transaction.value;
      this.$refs.inCoin.focus();
    },

    /**
     * Initiates the QR code scanner
     */
    scan () {
      this.$root.$emit("scanQRCode");
      this.$root.$emit("sendCoinModalOpened", false);
      if (typeof QRScanner !== "undefined") {
        setTimeout(() => {
          QRScanner.scan((err, text) => {
            console.log(text)
            if (err) {
              // an error occurred, or the scan was canceled (error code `6`)
              console.log(err);
            } else {
              Window.x = this;
              console.log(text);
              this.address = text;
              console.log(this.address)
              this.$root.$emit("cancelScanning");
              this.$root.$emit("sendCoinModalOpened", true);
            }
          });
        }, 500);
      }
    }
  }
};
</script>

<style>
</style>
