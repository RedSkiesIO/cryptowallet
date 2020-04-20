<template>
  <q-layout
    :class="{
      'no-balance': !isBalanceVisible,
      'short-top': shortTop,
      'single-wallet-top': showCoinHeader,
    }"
    view="lHh Lpr lFf"
  >
    <Header />

    <div class="q-pull-to-refresh-wrapper">
      <q-pull-to-refresh
        :disable="!isPullEnabled || isPullTempDisabled"
        color="cyan"
        @refresh="refresher"
      >
        <div
          class="flex justify-center"
          style="width: 100%"
        >
          <div class="background" />
          <div
            class="layout-wrapper"
            @touchmove="prevent"
          >
            <div
              v-if="showCoinHeader"
              class="coin-header-wrapper"
            >
              <CoinHeader
                :wallet="wallet"
                :simple="true"
              />
            </div>

            <div
              v-if="wallets.length > 0 && showTotalBalance"
              class="total-balance-wrapper"
            >
              <div
                v-if="showTotalBalance"
                class="total-balance flex flex-center"
              >
                <div>{{ totalBalance }}</div>
              </div>
            </div>

            <div
              :class="{ white: layoutShapeWhite }"
              class="layout-shape"
            >
              <keep-alive>
                <router-view />
              </keep-alive>
            </div>
          </div>
        </div>
      </q-pull-to-refresh>
    </div>

    <transition
      enter-active-class="animated slideInUp"
      leave-active-class="animated slideOutDown"
    >
      <q-footer>
        <MainNav />
      </q-footer>
    </transition>
  </q-layout>
</template>

<script>
import { mapState } from 'vuex';
import Wallet from '@/store/wallet/entities/wallet';
import MainNav from '@/layouts/MainNav';
import Header from '@/layouts/Header';
import CoinHeader from '@/components/Wallet/CoinHeader';
import {
  AmountFormatter,
  getBalance,
} from '@/helpers';


export default {
  name: 'AuthedLayout',
  components: {
    MainNav,
    Header,
    CoinHeader,
  },

  data() {
    return {
      isPullEnabled: true,
      isPullTempDisabled: false,
      transitionName: 'slide-left',
      isBalanceVisible: true,
      worker: null,
    };
  },

  computed: {
    ...mapState({
      id: (state) => { return state.route.params.id; },
      authenticatedAccount: (state) => { return state.settings.authenticatedAccount; },
      delay: (state) => { return state.settings.delay; },
    }),

    wallets() {
      return Wallet.query()
        .where('account_id', this.authenticatedAccount)
        .where('imported', true)
        .get();
    },

    wallet() {
      if (this.id) {
        return this.$store.getters['entities/wallet/find'](this.id);
      }
      return Wallet.query().where((wallet) => {
        return wallet.name === 'Catalyst' && wallet.account_id === this.authenticatedAccount;
      }).get()[0];
    },

    selectedCurrency() {
      return this.$store.state.settings.selectedCurrency;
    },

    totalBalance() {
      let balance = 0;

      this.wallets.forEach((wallet) => {
        const { unconfirmed } = getBalance(wallet, this.authenticatedAccount);

        const price = this.$store.getters['entities/latestPrice/find'](`${wallet.symbol}_${this.selectedCurrency.code}`);
        if (price) {
          const formattedAmount = new AmountFormatter({
            amount: unconfirmed,
            rate: price.data.PRICE,
            format: '0.00',
            coin: wallet.name,
            prependPlusOrMinus: false,
            currency: this.selectedCurrency,
            toCurrency: true,
            toCoin: false,
            withCurrencySymbol: false,
          });

          balance += parseFloat(formattedAmount.getFormatted());
        }
      });

      const formattedBalance = new AmountFormatter({
        amount: balance,
        format: '0,0[.]00',
        currency: this.selectedCurrency,
        toCurrency: false,
        toCoin: false,
        withCurrencySymbol: true,
      });

      return formattedBalance.getFormatted();
    },
    showTotalBalance() {
      return this.$route.name === 'sendCoin'
             || this.$route.name === 'receiveCoin'
             || this.$route.name === 'coinHistory'
             || this.$route.name === 'coinPrices';
    },
    layoutShapeWhite() {
      return this.$route.name === 'settings'
             || this.$route.name === 'exchange'
             || this.$route.name === 'walletSingle'
             || this.$route.name === 'sendCoinSingle'
             || this.$route.name === 'receiveCoinSingle'
             || this.$route.name === 'coinSinglePrices';
    },
    shortTop() {
      return this.$route.name === 'settings'
             || this.$route.name === 'exchange';
    },
    showCoinHeader() {
      return (this.$route.name === 'walletSingle' && this.wallet)
             || (this.$route.name === 'sendCoinSingle' && this.wallet)
             || (this.$route.name === 'receiveCoinSingle' && this.wallet)
             || (this.$route.name === 'coinSinglePrices' && this.wallet)
             || (this.$route.name === 'wallet');
    },
  },

  watch: {
    /**
     * Watch the $route to keep the MainNav visibility updated
     */
    '$route.path': {
      handler() {
        this.updateisPullEnabled();
      },
    },
  },

  /**
   * Make sure that the MainNav visibility is set correctly on initial render
   */
  beforeMount() {
    this.updateisPullEnabled();
  },

  mounted() {
    this.$root.$on('isHomeBalanceVisible', (value) => {
      this.isBalanceVisible = value;
    });
  },

  methods: {
    prevent() {
      return false;
    },

    updateisPullEnabled() {
      this.isPullEnabled = (this.$route.name === 'wallet' && this.wallets.length > 0) || this.$route.name === 'walletSingle';
    },

    refresher(done) {
      const online = window ? window.navigator.onLine : navigator.connection === 'none';
      if (online) {
        if (this.$route.name === 'wallet') {
          setTimeout(async () => {
            try {
              // await this.backEndService.loadPriceFeed();
              await this.updateBalances(done);
            } catch (err) {
              this.errorHandler(err);
              done();
            }
          }, this.delay.normal);
        } else {
          setTimeout(() => {
            this.$root.$emit('updateWalletSingle', done);
          }, this.delay.normal);
        }
      } else { done(); }
    },

    async updateBalances(done) {
      try {
        const promises = this.wallets.map((wallet) => {
          return this.$walletWorker.refreshWallet(wallet);
        });

        await Promise.all(promises);
        done();
      } catch (err) {
        this.errorHandler(err);
        done();
      }
    },
  },
};
</script>

<style>
.animated {
  animation-duration: 150ms;
}

.total-balance {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-family: 'CooperHewitt-BoldItalic';
  font-size: 2rem;
  line-height: 1;
  text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.5);
  height: 100%;
}

.total-balance > div {
  margin-top: 0.2em;
}

.total-balance-wrapper {
  transition: all ease-in-out 150ms;
  position: relative;
  top: 0;
  display: block!important;
  height: 17.5rem!important;
  position: absolute;
  width: 100%;
  opacity: 1;
  padding: 0 0.5rem;
}

.no-balance .total-balance-wrapper,
.short-top .total-balance-wrapper {
  top: -5rem;
  height: 0rem!important;
  opacity: 0;
}

.no-balance .scroll-area.extended {
  height: calc(100%);
}

.pull-to-refresh-message {
  transition: all ease-in-out 150ms;
  top: 0;
}

/*.no-balance .pull-to-refresh-message {
  top: -5rem!important;
}*/

.layout-shape .layout {
  height: calc(100vh - 5rem - 2.5rem);
  height: calc(100vh - 2.5rem - 5rem - constant(safe-area-inset-top));
  height: calc(100vh - 2.5rem - 5rem - env(safe-area-inset-top));
}

.layout-shape.white {
  background: none!important;
}

.no-balance .layout-shape {
  background: #19445b;
}

.background {
  transition: all ease-in-out 150ms;
}

.no-balance .background,
.short-top .background {
  height: 100%;
}

.single-wallet-top .background {
  height: 100%;
}

/*.q-pull-to-refresh-wrapper {
  padding-top: 2.5rem;
}*/

.q-pull-to-refresh-wrapper .pull-to-refresh-message {
  position: relative;
  z-index: 2
}

.coin-header-wrapper {
  height: 8rem!important;
  padding: 1rem 0.5rem;
}

.single-wallet-top .coin-header-wrapper {
  height: 20rem!important;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 0rem;
}

</style>
