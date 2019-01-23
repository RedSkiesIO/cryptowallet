<template>
  <div>
    <div class="send-coin-box">
      <h1>Send {{ wallet.name }}</h1>
      <div class="to">
        <q-input
          v-model="address"
          placeholder="address"
        />
        <q-btn
          :label="$t('paste')"
          color="primary"
          size="sm"
          @click="paste"
        />
        <q-btn
          :label="$t('scan')"
          color="primary"
          size="sm"
          @click="scan"
        />
      </div>
      <div class="amount">
        <div>
          <q-input
            v-model="amount"
            type="number"
            placeholder="amount"
          />
          <div>{{ coinSymbol }}</div>
        </div>
        <div>
          <q-input
            v-model="inCurrency"
            type="number"
            placeholder="amount"
          />
          <div>{{ selectedCurrency.code }}</div>
        </div>
      </div>
      <div>
        <div class="fee">
          <div class="label">Fee:</div>
          <q-slider
            v-model="feeSetting"
            :label-value="customFeeLabel(feeSetting)"
            :min="0"
            :max="2"
            :step="1"
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
          color="primary"
          size="md"
          @click="send"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { debounce } from 'quasar';
import AmountFormatter from '@/helpers/AmountFormatter';
import Address from '@/store/wallet/entities/address';
import Wallet from '@/store/wallet/entities/wallet';
import Tx from '@/store/wallet/entities/tx';
import Utxo from '@/store/wallet/entities/utxo';
import Spinner from '@/components/Spinner';

export default {
  name: 'SendBitcoin',
  components: {
    Spinner,
  },
  data() {
    return {
      address: '',
      amount: '',
      inCurrency: '',
      feeSetting: 1,
      estimatedFee: 'N/A',
      utxos: [],
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
      return this.$store.state.settings.supportedCoins;
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
    amount(val) {
      if (val === null || val === '') return false;
      this.amountToCurrency(val);
      this.updateFee(this.feeSetting, this);
      return false;
    },
    inCurrency(val) {
      if (val === null || val === '') return false;
      this.currencyToAmount(val);
      this.updateFee(this.feeSetting, this);
      return false;
    },
  },

  mounted() {
    this.fetchUTXOs();
  },

  methods: {
    /**
     * Fetches UTXOs
     */
    fetchUTXOs() {
      const coinSDK = this.coinSDKS[this.wallet.sdk];
      const addressesRaw = this.getAddressesRaw();
      coinSDK.getUTXOs(addressesRaw, this.wallet.network)
        .then((utxos) => {
          console.log('mounted, utxos:', utxos);
          this.utxos = utxos;
        });
    },

    /**
     * Allows to display a custom fee label on Quasar component
     */
    customFeeLabel(feeSetting) {
      if (feeSetting === 0) return 'small';
      if (feeSetting === 1) return 'recommended';
      return 'high';
    },

    /**
     * Once transaction was broadcasted successfully
     * resets the state and displays a toast
     */
    completeTransaction() {
      const initialState = this.$options.data.apply(this);
      delete initialState.utxos;
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
     * Calls update fee with context passed when user adjusts fee
     */
    feeChange(fee) {
      this.updateFee(fee, this);
    },

    /**
     * Creates a raw transaction which will calculate and update the fee
     */
    updateFee: debounce((fee, that) => {
      /*eslint-disable*/
      console.log('utxos', that.utxos);


      const {
        filteredUtxos,
        pendingCount,
      } = that.filterOutPending(that.utxos);

      const changeAddresses = that.generateChangeAddresses(filteredUtxos, pendingCount);
      const wallet = that.activeWallets[that.authenticatedAccount][that.wallet.name];
      const accounts = that.getAccounts();

      that.createRawTx(accounts, changeAddresses, filteredUtxos, wallet, that.address, that.amount);
    }, 250),

    /**
     * Returns addresses
     * @return {Array<Object>}
     */
    getAddresses() {
      return Address.query()
        .where('account_id', this.authenticatedAccount)
        .where('wallet_id', this.wallet.id)
        .where('used', false)
        .get();
    },

    /**
     * Returns raw addresses
     * @return {Array<String>}
     */
    getAddressesRaw() {
      const addresses = this.getAddresses();
      const addressesRaw = addresses.map(item => item.address);

      function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
      }

      return addressesRaw.filter(onlyUnique);
    },

    /**
     * Returns accounts
     * @return {Array<Object>}
     */
    getAccounts() {
      const addresses = this.getAddresses();
      function mapToAccounts(item) {
        return {
          address: item.address,
          index: item.index,
          change: item.chain === 'internal',
        };
      }

      return addresses.map(mapToAccounts);
    },

    /**
     * Filters out recently used, pending UTXOs
     * @param  {Array<Object>} utxos
     * @return {Object}
     */
    filterOutPending(utxos) {
      utxos.forEach((utxo) => {
        const found = Utxo.query()
          .where('txid', utxo.txid)
          .where('vout', utxo.vout)
          .where('wallet_id', this.wallet.id)
          .get();

        if (found) return false;
        utxo.account_id = this.authenticatedAccount;
        utxo.wallet_id = this.wallet.id;
        Utxo.$insert({ data: utxo });
        return false;
      });

      const pendingUtxos = Utxo.query()
        .where('account_id', this.authenticatedAccount)
        .where('wallet_id', this.wallet.id)
        .where('pending', true)
        .get();

      // filter out the pending UTXOs
      const filteredUtxos = utxos.filter((utxo) => {
        const found = pendingUtxos.find((pendingUtxo) => {
          if (utxo.txid === pendingUtxo.txid && utxo.vout === pendingUtxo.vout) return true;
          return false;
        });

        if (!found) return true;
        return false;
      });

      return {
        filteredUtxos,
        pendingCount: pendingUtxos.length,
      };
    },

    /**
     * Generates change addresses
     * @param  {Array<Object>} filteredUtxos
     * @param  {Number} pendingCount
     * @return {Array<String>}
     */
    generateChangeAddresses(filteredUtxos, pendingCount) {
      let quantityToGenerate = 1;
      if (filteredUtxos.length === 1 && pendingCount === 0) quantityToGenerate = 2;

      const coinSDK = this.coinSDKS[this.wallet.sdk];
      const wallet = this.activeWallets[this.authenticatedAccount][this.wallet.name];

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
    async createRawTx(accounts, changeAddresses, filteredUtxos, wallet, address, amount) {
      if (!address || !amount) return false;

      const coinSDK = this.coinSDKS[this.wallet.sdk];
      const fees = await coinSDK.getTransactionFee(this.wallet.network);

      let fee = fees.medium;
      if (this.feeSetting === 0) fee = fees.low;
      if (this.feeSetting === 2) fee = fees.high;
      fee = Math.round(fee);

      /* console.log(accounts);
      console.log(changeAddresses);
      console.log(filteredUtxos);
      console.log(wallet);
      console.log(address);
      console.log(amount);
      console.log(fee); */

      try {
        const {
          hexTx,
          transaction,
          utxo,
        } = await coinSDK.createRawTx(
          accounts,
          changeAddresses,
          filteredUtxos,
          wallet,
          address,
          amount,
          fee,
        );

        const formattedFee = new AmountFormatter({
          amount: transaction.fee,
          rate: this.latestPrice,
          format: '0.00',
          coin: this.wallet.name,
          currency: this.selectedCurrency,
          toCurrency: true,
          withCurrencySymbol: true,
        });

        this.estimatedFee = formattedFee.getFormatted();

        return {
          hexTx,
          transaction,
          utxo,
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


      console.log(this.wallet.balance, this.amount);

      if (this.wallet.balance < this.CoinFormatter.toDenomination(this.wallet.name, this.amount)) {
        this.$toast.create(10, this.$t('notEnoughFunds'), 500);
        return false;
      }

      this.sendingModalOpened = true;
      const coinSDK = this.coinSDKS[this.wallet.sdk];
      const wallet = this.activeWallets[this.authenticatedAccount][this.wallet.name];

      // there are no UTXOs available, wallet is empty
      if (this.utxos.length === 0) {
        this.$toast.create(10, this.$t('noFunds'), 500);
        this.sendingModalOpened = false;
        return false;
      }

      const {
        filteredUtxos,
        pendingCount,
      } = this.filterOutPending(this.utxos);

      // there is enough funds, but UTXOs are pending
      if (filteredUtxos.length === 0) {
        this.$toast.create(10, this.$t('fundsPending'), 500);
        this.sendingModalOpened = false;
        return false;
      }

      console.log('filteredUtxos', filteredUtxos);

      const changeAddresses = this.generateChangeAddresses(filteredUtxos, pendingCount);
      const accounts = this.getAccounts();

      const {
        hexTx,
        transaction,
        utxo,
      } = await this.createRawTx(
        accounts,
        changeAddresses,
        filteredUtxos,
        wallet,
        this.address,
        this.amount,
      );

      console.log('hex', hexTx);
      console.log('tx', transaction);
      console.log('used utxo', utxo);
      console.log(this.wallet.network);

      coinSDK.broadcastTx(hexTx, this.wallet.network)
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

          utxo.forEach((usedUtxo) => {
            const whereUtxo = (record, item) => (
              record.txid === item.txid
              && record.vout === item.vout
              && record.wallet_id === this.wallet.id
            );

            Utxo.$update({
              where: record => whereUtxo(record, usedUtxo),
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
            where: record => record.id === this.wallet.id,
            data: { internalChainAddressIndex: newInternalIndex },
          });

          this.completeTransaction();
          return false;
        })
        .catch((err) => {
          alert(err);
          console.log(err);
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

    /**
     * Initiates the QR code scanner
     */
    scan() {
      this.$root.$emit('scanQRCode');
      QRScanner.scan((err, text) => {
        if (err) {
          // an error occurred, or the scan was canceled (error code `6`)
        } else {
          this.address = text;
          this.$root.$emit('cancelScanning');
        }
      });
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

<style scoped>
.send-coin-box h1 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.send-coin-box {
  padding: 0.5rem;
}

.to {
  display: flex;
  justify-content: space-between;
}

.to > div {
  width: 100%;
}

.amount > div {
  display: flex;
  align-items: center;
}

.sending-wallet-modal {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-around;
  font-size: 1.1em;
  line-height: 1;
}

.fee {
  margin-right: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.fee > .label {
  margin-right: 2rem;
}

.send {
  margin-top: 1rem;
  display: flex;
  padding: 1rem;
  justify-content: flex-end;
}
</style>
