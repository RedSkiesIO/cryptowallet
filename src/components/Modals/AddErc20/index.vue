<template>
  <div>
    <q-modal
      v-model="addErc20ModalOpened"
      class="light-modal modal"
    >
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
        <h1 class="header-h1">Add Token</h1>
      </div>
      <q-tabs
        swipeable
        color="secondary"
        inverted
        align="justify">
        <q-tab
          slot="title"
          default
          name="search"
          label="Search" />
        <q-tab
          slot="title"
          name="custom"
          label="Custom Token" />


        <q-tab-pane name="search">
          <q-search
            v-model="searchName"
            placeholder="Start typing a token name">
            <q-autocomplete
              :static-data="tokens"
              :value-field="v => ` ${ v.label } (${ v.symbol })`"
              class= "autocomplete"
              @selected="selected" />
          </q-search>
        </q-tab-pane>
        <q-tab-pane name="custom">
          <div
            class="modal-layout-wrapper"
          >
            <div class="send-coin-box">
              <div class="send-modal-heading">
                <h4>Contract Address</h4>
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
                  v-model="form.tokenContract"
                  :error="$v.form.tokenContract.$error"
                  placeholder="token contract address"
                  class="sm-input grey-input"
                  inverted
                  clearable
                  autofocus
                  @blur="checkField('contract')"
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
              <span class="error">{{ contractError }}</span>
              <div class="send-modal-heading">
                <h4>Name</h4>
                <span class="h3-line"/>
              </div>
              <div class="to">
                <q-input
                  v-model="form.tokenName"
                  :error="$v.form.tokenName.$error"
                  :disable="disableInputs"
                  :loading="loadingInputs"
                  placeholder="name"
                  class="sm-input grey-input"
                  inverted
                  clearable
                  @blur="checkField('name')"
                />

              </div>
              <span class="error">{{ nameError }}</span>

              <div class="send-modal-heading">
                <h4>Symbol</h4>
                <span class="h3-line"/>
              </div>
              <div class="to">
                <q-input
                  v-model="form.tokenSymbol"
                  :error="$v.form.tokenSymbol.$error"
                  :disable="disableInputs"
                  :loading="loadingInputs"
                  placeholder="symbol"
                  class="sm-input grey-input"
                  inverted
                  clearable
                  upper-case
                  @blur="checkField('symbol')"
                />

              </div>
              <span class="error">{{ symbolError }}</span>
              <div class="send-modal-heading">
                <h4>Decimals</h4>
                <span class="h3-line"/>
              </div>
              <div class="to">
                <q-input
                  v-model="form.tokenDecimals"
                  :error="$v.form.tokenDecimals.$error"
                  :disable="disableInputs"
                  :loading="loadingInputs"
                  placeholder="decimals"
                  class="sm-input grey-input"
                  type="number"
                  inverted
                  clearable
                  @blur="checkField('decimals')"
                />

              </div>
              <span class="error">{{ decimalsError }}</span>
              <div class="send">
                <q-btn
                  :disable="disableButton"
                  label="add"
                  color="blueish"
                  size="md"
                  @click="validate"
                />
              </div>
            </div>
          </div>

        </q-tab-pane>

      </q-tabs>
    </q-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { required, alphaNum, numeric, between, minLength, maxLength } from 'vuelidate/lib/validators';
import CoinHeader from '@/components/Wallet/CoinHeader';
import Wallet from '@/store/wallet/entities/wallet';
import Coin from '@/store/wallet/entities/coin';
import tokens from '@/statics/contractMeta/contract-map.json';
// import tokens from '@/statics/tokens.json';


export default {
  name: 'AddErc20',
  components: {
    CoinHeader,
  },
  data() {
    return {
      addErc20ModalOpened: false,
      form: {
        tokenContract: '',
        tokenName: '',
        tokenSymbol: '',
        tokenDecimals: '',
        tokenNetwork: 'ETHEREUM_ROPSTEN',
      },
      disableInputs: true,
      loadingInputs: false,
      disableButton: true,
      selected: '',
      searchName: '',
      tokens,
      contractError: '',
      nameError: '',
      symbolError: '',
      decimalsError: '',
    };
  },
  validations: {
    form: {
      tokenContract: {
        required, alphaNum, minLength: minLength(42), maxLength: maxLength(42),
      },
      tokenName: { required },
      tokenSymbol: {
        required, alphaNum, between: minLength(1), maxLength: maxLength(11),
      },
      tokenDecimals: { required, numeric, between: between(0, 36) },
    },
  },
  computed: {
    ...mapState({
      id: state => state.route.params.id,
      authenticatedAccount: state => state.settings.authenticatedAccount,
    }),
    account() {
      return this.$store.getters['entities/account/find'](this.authenticatedAccount);
    },
    wallet() {
      return this.$store.getters['entities/wallet/find'](this.id);
    },
    supportedCoins() {
      return Coin.all();
    },
  },
  mounted() {
    this.$root.$on('erc20ModalOpened', (value) => {
      this.addErc20ModalOpened = value;
    });
  },
  methods: {
    isEthEnabled(network) {
      const result = Wallet.query(network)
        .where('account_id', this.authenticatedAccount)
        .where('name', network)
        .where('enabled', true)
        .get();
      return result.length > 0;
    },
    async checkField(field) {
      if (field === 'contract') {
        this.$v.form.tokenContract.$touch();
        if (this.$v.form.tokenContract.$error) {
          this.disableInputs = true;
          this.disableButton = true;
          this.contractError = 'The contract address must be 42 characters in length.';
          return;
        }
        this.loadingInputs = true;
        this.contractError = ' ';

        const coinSDK = this.coinSDKS.ERC20;
        try {
          const info = await coinSDK.getTokenData(this.form.tokenContract, 'ETHEREUM_ROPSTEN');
          if (info) {
            this.form.tokenName = info.name;
            this.form.tokenSymbol = info.symbol;
            this.form.tokenDecimals = info.decimals;
            this.loadingInputs = false;
            this.disableButton = false;
            return;
          }
          this.loadingInputs = false;
          this.disableInputs = false;
          this.disableButton = false;
        } catch (err) {
          console.log('err :', err);
          this.disableButton = true;
          this.loadingInputs = false;
          this.contractError = err.message;
          return;
        }
      }
      if (field === 'name') {
        this.$v.form.tokenName.$touch();

        if (this.$v.form.tokenName.$error) {
          this.nameError = 'Token name is required';
          return;
        }
        this.nameError = ' ';
      }
      if (field === 'symbol') {
        this.$v.form.tokenSymbol.$touch();
        if (this.$v.form.tokenSymbol.$error) {
          this.symbolError = 'Token Symbol must be between 0 and 12 characters';
          return;
        }
        this.symbolError = ' ';
      }
      if (field === 'decimals') {
        this.$v.form.tokenDecimals.$touch();
        if (this.$v.form.tokenDecimals.$error) {
          this.decimalsError = 'Token Decimals must be at least 0, and not over 36.';
          return;
        }
        this.decimalsError = ' ';
      }
    },
    async validate() {
      this.$v.form.$touch();
      if (this.$v.form.$error) {
        if (this.$v.form.tokenContract.$error) {
          this.contractError = 'The contract address must be 42 characters in length.';
        }
        if (this.$v.form.tokenName.$error) {
          this.nameError = 'Token name is required';
        }
        if (this.$v.form.tokenSymbol.$error) {
          this.symbolError = 'Token Symbol must be between 0 and 12 characters';
        }
        if (this.$v.form.tokenDecimals.$error) {
          this.decimalsError = 'Token Decimals must be at least 0, and not over 36.';
        }
        return false;
      }
      const coinSDK = this.coinSDKS.Ethereum;
      const valid = await coinSDK.validateAddress(this.form.tokenContract.toLowerCase(), 'ETHEREUM_ROPSTEN');
      console.log('valid :', valid);
      // eslint-disable-next-line max-len
      if (!valid || !this.form.tokenName || !this.form.tokenSymbol || !this.form.tokenContract) { return false; }
      await this.enableWallet();
      this.goBack();
      return true;
    },
    async enableWallet() {
      if (!this.isEthEnabled('Ethereum')) {
        const eth = this.supportedCoins.find(coin => coin.name === 'Ethereum');

        const data = {
          name: eth.name,
          displayName: eth.displayName,
          sdk: eth.sdk,
          account_id: this.authenticatedAccount,
          network: eth.network,
          symbol: eth.symbol,
        };
        const ethWalletResult = await Wallet.$insert({ data });
        const ethWalletId = ethWalletResult.wallet[0].id;

        Wallet.$update({
          where: record => record.id === ethWalletId,
          data: { imported: false, enabled: true },
        });
      }

      const isThere = Coin.find([this.form.tokenName]);

      if (!isThere) {
        console.log('adding coin');
        const data = {
          name: this.form.tokenName,
          displayName: this.form.tokenName,
          sdk: 'ERC20',
          symbol: this.form.tokenSymbol,
          network: this.form.tokenNetwork,
          denomination: '0.00000000',
          parentSdk: 'Ethereum',
          parentName: 'Ethereum',
          contractAddress: this.form.tokenContract,
          decimals: this.form.tokenDecimals,
        };
        Coin.$insert({
          data,
        });

        const newWalletResult = await Wallet.$insert({ data });
        const newWalletId = newWalletResult.wallet[0].id;
        await Wallet.$update({
          where: record => record.id === newWalletId,
          data: {
            account_id: this.authenticatedAccount, imported: false, enabled: true, parentName: 'Ethereum',
          },
        });
      } else {
        console.log('already exists');
        this.$q.notify('This token has already been enabled');
      }
    },
    /**
     * Pastes in the text from the clipboard
     */
    paste() {
      cordova.plugins.clipboard.paste((text) => {
        this.form.tokenContract = text;
      });
    },

    /**
     * Initiates the QR code scanner
     */
    scan() {
      this.$root.$emit('scanQRCode', 'addErc20');
      this.addErc20ModalOpened = false;
      this.$root.$emit('walletsModalOpened', false);
      if (typeof QRScanner !== 'undefined') {
        setTimeout(() => {
          QRScanner.scan((err, text) => {
            if (err) {
              // an error occurred, or the scan was canceled (error code `6`)
            } else {
              this.form.tokenContract = text;
              this.$root.$emit('cancelScanning');
              this.$root.$emit('walletsModalOpened', true);
              this.addErc20ModalOpened = true;
            }
          });
        }, 500);
      }
    },

    clearFields() {
      Object.keys(this.form).forEach((k) => { this.form[k] = ''; });
    },
    goBack() {
      this.clearFields();
      this.addErc20ModalOpened = false;
    },
  },
};
</script>

<style>
.send-coin-box {
  margin-top: 2rem;
  width: 100%;
}

.to {
  display: flex;
  justify-content: space-between;
}

.send-coin-box .q-input {
  flex: 1;
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 2rem;
  overflow: hidden;
}

.fee > .label {
  margin-right: 2rem;
}

.fee .q-slider-label {
  padding: 0.3rem 0.5rem;
  text-align: center;
  font-size: 0.8rem;
}

.estimated-fee {
  font-size: 0.8rem;
  text-align: center;
}

.send {
  margin-top: 1rem;
  display: flex;
  padding-top: 1rem;
  justify-content: center;
}
.to .q-if-inverted .q-if-control {
  color: #ccc;
}

/* .send button.q-btn {
    border: 1px solid;
    border-color: #475876;
    background: white;
} */
.send-modal-heading {
  position: relative;
  margin: 0.7rem 0 .5rem 0;
  overflow: hidden;
}

.send-modal-heading h4 {
  display: inline-block;
  margin: 0;
  margin-right: 1rem;
}

.send-modal-heading .h3-line {
  width: 100%;
  border-bottom: 1px solid whitesmoke;
  display: inline-block;
  position: absolute;
  top: 50%;
}

.sm-input {
  font-size: 0.7rem;
}

.qr-code-wrapper {
  width: 3rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid black;
  position: relative;
  cursor: pointer;
}

.qr-code-wrapper {
  width: 90%;
  height: 90%;
  position: relative;
  z-index: 2;
}

.qr-code-wrapper .hor-line {
  height: 50%;
  width: 110%;
  background: white;
  position: absolute;
  z-index: 1;
}

.qr-code-wrapper .ver-line {
  height: 110%;
  width: 50%;
  background: white;
  position: absolute;
  z-index: 1;
}

.side-content {
  width: 3rem;
  margin-left: 0.5rem;
  text-align: center;
}

.amount-div-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.grey-input {
  background: whitesmoke!important;
  box-shadow: none;
  border: 1px solid rgba(0,0,0,0.2);
}

.grey-input input {
  color: #1e3c57!important;
}

.grey-input.q-if-inverted:not(.q-if-inverted-light) .q-input-target::-webkit-input-placeholder {
  color: #afafaf !important;
}

.error {
  color: red;
  min-height: 0.5em;
  display: inline-block;
}

.autocomplete .q-item{
  margin: 0.5em;
}
.autocomplete .q-item-image{
  min-width: 48px;
  max-width: 48px;
}
.autocomplete .q-item-label{
  color:black;
}
</style>
