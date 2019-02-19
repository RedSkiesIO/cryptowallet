<template>
  <div>
    <q-modal
      v-model="sendCoinModalOpened"
      class="light-modal modal"
      no-route-dismiss
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
        <h1 class="header-h1">
          Send
        </h1>
      </div>
      <div
        v-if="wallet"
        class="modal-layout-wrapper"
      >
        <CoinHeader :wallet="wallet" />

        <div v-if="wallet.sdk === 'Bitcoin'">
          <SendBitcoin />
        </div>

        <div v-if="wallet.sdk === 'Ethereum'">
          <SendEtehreum />
        </div>

        <div v-if="wallet.sdk === 'ERC20'">
          <SendErc20 />
        </div>
      </div>
    </q-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import CoinHeader from '@/components/Wallet/CoinHeader';
import SendBitcoin from '@/components/Wallet/SendCoin/SendBitcoin.vue';
import SendEtehreum from '@/components/Wallet/SendCoin/SendEtehreum.vue';
import SendErc20 from '@/components/Wallet/SendCoin/SendErc20.vue';

export default {
  name: 'SendCoin',
  components: {
    SendBitcoin,
    SendEtehreum,
    SendErc20,
    CoinHeader,
  },
  data() {
    return {
      sendCoinModalOpened: false,
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
  },
  watch: {
    $route: {
      handler(to) {
        if (to.name === 'sendCoin' || to.name === 'sendCoinSingle') {
          this.sendCoinModalOpened = true;
        } else {
          this.sendCoinModalOpened = false;
        }
      },
    },
    sendCoinModalOpened: {
      handler(newVal, oldVal) {
        if (oldVal === true && newVal === false) {
          if (this.$store.state.route.name === 'sendCoin' && !this.$q.scanning) this.$router.go(-1);
        }
      },
    },
  },
  mounted() {
    this.$root.$on('sendCoinModalOpened', (value) => {
      this.sendCoinModalOpened = value;
    });
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style>
.send-coin-box {
  margin-top: 1.5rem;
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
  padding: 0 1.5rem;
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

.send-modal-heading {
  position: relative;
  margin: 1.5rem 0 .5rem 0;
  overflow: hidden;
}

.send-modal-heading h3 {
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

.qr-code-wrapper img {
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

.send-heading-btn {
  border: 1px solid #d4d4d4;
  background: whitesmoke;
  position: absolute;
  right: 0;
  padding: 0;
  width: 3rem;
  height: 0;
  min-height: 1.5rem;
  text-transform: none;
  font-family: Montserrat-SemiBold!important;
}

.send-heading-btn.active {
  border: 1px solid #de4662;
}

.send-modal-heading .help-icon {
  background: white;
  z-index: 2;
  position: relative;
  top: -0.1rem;
  margin-left: 0.1rem;
  color: #e49ebe;
}

.error-label {
  color: red;
  min-height: 0.5em;
  display: inline-block;
  font-size: 12px;
}


</style>