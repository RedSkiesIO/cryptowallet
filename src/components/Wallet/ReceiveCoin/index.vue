<template>
  <div>
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
        {{ $t('receive') }}
      </h1>
      <!-- <div
        class="header-settings-button-wrapper"
      >
        <q-btn
          icon="share"
          color="secondary"
          size="lg"
          class="icon-btn icon-btn-right"
          flat
          @click.prevent="share()"
        />
      </div> -->
    </div>
    <div
      v-if="wallet"
      class="modal-layout-wrapper"
    >
      <div class="receive-coin-box">
        <CoinHeader :wallet="wallet" />

        <div class="send-modal-heading">
          <h3>{{ $t('yourAddress') }}</h3>
          <span class="h3-line" />
        </div>
        <div class="address break">
          {{ address }}
          <q-btn
            :label="$t('copy')"
            size="sm"
            class="receive-copy-btn"
            @click="copyToClipboard"
          />
        </div>
        <div class="send-modal-heading">
          <h3>{{ $t('scanQR') }}</h3>
          <span class="h3-line" />
        </div>

        <div class="qr-code">
          <img
            v-if="qrCodeDataURL"
            :src="qrCodeDataURL"
          >
        </div>
        <div
          class="set-amount row justify-center"
        >
          <q-expansion-item
            v-model="setAmount"
            :label="$t('setAmount')"
            popup
            @input="toggleSetAmount"
          >
            <q-card>
              <q-card-section>
                <span class="h3-line" />

                <q-input
                  v-model="amount"
                  type="number"
                  placeholder="0"
                  class="sm-input amount-in-coin"
                  outlined
                  dense
                  color="primary"
                  :suffix="wallet.symbol"
                  @input="qrCodeWithAddress"
                />
                <span class="error-label error-label-amount">
                  {{ amountError }}
                </span>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </div>
        <div
          v-if="wallet.sdk==='Bitcoin'"
          class="new-address row justify-center"
        >
          <p>
            {{ $t('newAddress1') }} {{ wallet.name }} {{ $t('newAddress2') }}
            <q-icon
              name="help_outline"
              size="1.1rem"
              class="help-icon"
              @click="hdWalletDialogOpened = true"
            />
          </p>
        </div>
        <q-dialog
          v-model="hdWalletDialogOpened"
        >
          <q-card
            style="width: 300px"
            class="dialog"
          >
            <q-card-section>
              <h2>
                {{ $t('hdWallet') }}
              </h2>
              <p>
                {{ $t('hdWalletExplainer') }}
              </p>
            </q-card-section>

            <q-card-actions align="right">
              <q-btn
                v-close-popup
                flat
                :label="$t('ok')"
                color="blueish"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import QRCode from 'qrcode';
import CoinHeader from '@/components/Wallet/CoinHeader';
import Coin from '@/store/wallet/entities/coin';
import Wallet from '@/store/wallet/entities/wallet';


export default {
  name: 'Receive',
  components: {
    CoinHeader,
  },
  data() {
    return {
      qrCodeDataURL: null,
      hdWalletDialogOpened: false,
      amount: null,
      amountError: '',
      setAmount: false,
    };
  },
  computed: {
    ...mapState({
      id: (state) => { return state.route.params.id; },
      delay: (state) => { return state.settings.delay; },
    }),
    wallet() {
      if (this.id) {
        return this.$store.getters['entities/wallet/find'](this.id);
      }
      return Wallet.query().where((wallet) => {
        return wallet.name === 'Catalyst' && wallet.account_id === this.authenticatedAccount;
      }).get()[0];
    },
    walletName() {
      return this.wallet.name.replace(/\s/g, '').toLowerCase();
    },
    address() {
      if (!this.wallet.externalAddress) { return null; }
      return this.wallet.externalAddress;
    },
    decimals() {
      return Coin.find(this.wallet.name).decimals;
    },
  },
  mounted() {
    this.qrCode();
  },
  methods: {
    copyToClipboard() {
      try {
        this.$clipboard(this.address);
        this.$toast.create(0, this.$t('copied'), this.delay.normal);
      } catch (err) {
        this.errorHandler(err);
      }
    },
    toggleSetAmount(val) {
      if (!val) {
        this.amount = null;
        this.qrCode();
      }
    },
    countDecimals(value) {
      if (value.toString().split('.')[1]) {
        return value.toString().split('.')[1].length;
      }
      return 0;
    },
    qrCodeWithAddress() {
      if (this.amount > 0) {
        if (this.countDecimals(this.amount) <= this.decimals) {
          this.amountError = '';
          const newAddress = `${this.walletName}:${this.address}?amount=${this.amount}`;
          this.qrCode(newAddress);
        } else {
          this.amountError = this.$t('amountError');
          this.qrCode();
        }
      } else {
        this.qrCode();
      }
    },
    async qrCode(qrAddress = this.address) {
      const options = {
        width: 250,
        height: 250,
      };
      if (typeof this.address === 'string') {
        await QRCode.toDataURL(qrAddress, options, (err, url) => {
          if (err) {
            this.errorHandler(err);
          } else {
            this.qrCodeDataURL = url;
          }
        });
      }
    },
    share() {
      const options = {
        message: `${this.address}`,
      };

      const onError = (msg) => {
        this.errorHandler(new Error(msg));
      };
      window.plugins.socialsharing.shareWithOptions(options, () => {}, onError);
    },
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>

.address {
  font-size: 0.8rem;
  margin: 1rem 0;
}

.break {
  word-break: break-all;
}

.to-copy-input {
  position: absolute;
  left: -9999px;
}

.qr-code {
  margin: 0rem;
  display: flex;
  justify-content: center;
}

.share-btn {
  margin-left: 0.5rem;
}

.new-address {
  padding: 0 1rem;
  text-align: center;
}

.help-icon {
  background: white;
  z-index: 2;
  position: relative;
  top: -0.1rem;
  margin-left: 0.1rem;
  color: #e49ebe;
}

.receive-copy-btn {
  border: 1px solid #d4d4d4;
  background: whitesmoke;
  padding: 0;
  margin: 0 1px;
  width: 4rem;
  height: 0;
  min-height: 1.5rem;
  text-transform: none;
  font-family: Montserrat-SemiBold!important;
}

.set-amount .q-expansion-item--popup > .q-expansion-item__container {
  border: none;
}
</style>
