<template>
  <q-layout
    :class="{
      'no-balance': !isBalanceVisible,
      'short-top': shortTop,
      'single-wallet-top': singleWalletTop,
    }"
    view="lHh Lpr lFf"
  >
    <Header />

    <div class="q-pull-to-refresh-wrapper">
      <q-pull-to-refresh
        :handler="refresher"
        :disable="!isPullEnabled || isPullTempDisabled"
        color="cyan"
      >
        <div class="background" />
        <div
          :class="{ 'no-footer': !isMainNavVisible }"
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

          <div class="total-balance-wrapper">
            <div
              v-if="showTotalBalance"
              class="total-balance"
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
      </q-pull-to-refresh>
    </div>

    <transition
      enter-active-class="animated slideInUp"
      leave-active-class="animated slideOutDown"
    >
      <q-footer v-show="isMainNavVisible">
        <MainNav />
      </q-footer>
    </transition>
  </q-layout>
</template>

<script>
import { mapState } from 'vuex';
import Wallet from '@/store/wallet/entities/wallet';
import AmountFormatter from '@/helpers/AmountFormatter';
import MainNav from '@/layouts/MainNav';
import Header from '@/layouts/Header';
import CoinHeader from '@/components/Wallet/CoinHeader';
import Address from '@/store/wallet/entities/address';
import Utxo from '@/store/wallet/entities/utxo';

export default {
  name: 'AuthedLayout',
  components: {
    MainNav,
    Header,
    CoinHeader,
  },

  data() {
    return {
      isMainNavVisible: false,
      isPullEnabled: true,
      isPullTempDisabled: false,
      transitionName: 'slide-left',
      isBalanceVisible: true,
    };
  },

  computed: {
    ...mapState({
      id: (state) => { return state.route.params.id; },
      isSearchingContacts: (state) => { return state.search.isSearchingContacts; },
      authenticatedAccount: (state) => { return state.settings.authenticatedAccount; },
    }),

    wallets() {
      return Wallet.query()
        .where('account_id', this.authenticatedAccount)
        .where('imported', true)
        .get();
    },

    wallet() {
      return this.$store.getters['entities/wallet/find'](this.id);
    },

    selectedCurrency() {
      return this.$store.state.settings.selectedCurrency;
    },

    latestPrice() {
      const prices = this.$store.getters['entities/latestPrice/all'];
      return prices;
    },

    totalBalance() {
      let balance = 0;
      this.wallets.forEach((wallet) => {
        const price = this.$store.getters['entities/latestPrice/find'](`${wallet.symbol}_${this.selectedCurrency.code}`);
        if (price) {
          const formattedAmount = new AmountFormatter({
            amount: wallet.confirmedBalance,
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
      return this.$route.name === 'wallet'
             || this.$route.name === 'sendCoin'
             || this.$route.name === 'receiveCoin'
             || this.$route.name === 'coinHistory'
             || this.$route.name === 'coinPrices';
    },
    layoutShapeWhite() {
      return this.$route.name === 'settings'
             || this.$route.name === 'exchange'
             || this.$route.name === 'walletSingle'
             || this.$route.name === 'sendCoinSingle'
             || this.$route.name === 'coinSinglePrices';
    },
    shortTop() {
      return this.$route.name === 'settings'
             || this.$route.name === 'exchange';
    },
    showCoinHeader() {
      return (this.$route.name === 'walletSingle' && this.wallet)
             || (this.$route.name === 'sendCoinSingle' && this.wallet)
             || (this.$route.name === 'coinSinglePrices' && this.wallet);
    },
    singleWalletTop() {
      return (this.$route.name === 'walletSingle' && this.wallet)
             || (this.$route.name === 'sendCoinSingle' && this.wallet)
             || (this.$route.name === 'coinSinglePrices' && this.wallet);
    },
  },

  watch: {
    /**
     * Watch the $route to keep the MainNav visibility updated
     */
    '$route.path': {
      handler() {
        this.updateMainNavVisibility();
        this.updateisPullEnabled();
      },
    },

    /**
     * Watch the isSearchingContacts to keep the MainNav visibility updated
     */
    isSearchingContacts() { this.updateMainNavVisibility(); },
  },

  /**
   * Make sure that the MainNav visibility is set correctly on initial render
   */
  beforeMount() {
    this.updateMainNavVisibility();
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

    /**
     * Decide if the MainNav component should be visible
     * Update MainNav component visibility
     * @TODO James review future
     */
    updateMainNavVisibility() {
      if (this.$route.path === '/wallet/payments' && this.isSearchingContacts) {
        this.isMainNavVisible = false;
      } else {
        this.isMainNavVisible = true;
      }
    },

    updateisPullEnabled() {
      this.isPullEnabled = this.$route.name === 'wallet' || this.$route.name === 'walletSingle';
    },

    refresher(done) {
      if (this.$route.name === 'wallet') {
        setTimeout(async () => {
          try {
            await this.backEndService.loadPriceFeed();
            await this.updateBalances(done);
          } catch (err) {
            this.errorHandler(err);
            done();
          }
        }, 1000);
        return false;
      }

      if (this.$route.name === 'walletSingle') {
        setTimeout(() => {
          this.$root.$emit('updateWalletSingle', done);
        }, 1000);
      }

      return false;
    },

    async getUtxos(combinedAddresses, wallet) {
      if (wallet.sdk) {
        const coinSDK = this.coinSDKS[wallet.sdk];
        const utxos = await coinSDK.getUTXOs(combinedAddresses, wallet.network);

        let balance = 0;
        utxos.forEach((utxo) => {
          balance += utxo.amount;
          const found = Utxo.query()
            .where('txid', utxo.txid)
            .where('vout', utxo.vout)
            .where('wallet_id', wallet.id)
            .get();

          if (!found[0]) {
            utxo.account_id = this.authenticatedAccount;
            utxo.wallet_id = wallet.id;
            Utxo.$insert({ data: utxo });
          }
        });

        return {
          utxos,
          balance,
        };
      }
      return {};
    },

    async updateBalances(done) {
      const promises = [];

      function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
      }

      this.wallets.forEach((wallet) => {
        promises.push(new Promise(async (resolve, reject) => {
          try {
            const coinSDK = this.coinSDKS[wallet.sdk];

            const addresses = Address.query()
              .where('account_id', this.authenticatedAccount)
              .where('wallet_id', wallet.id)
              .where('used', false)
              .get();

            let addressesRaw = addresses.map((item) => { return item.address; });

            addressesRaw = addressesRaw.filter(onlyUnique);

            let newBalance;
            if (wallet.sdk === 'Bitcoin') {
              const result = await this.getUtxos(addressesRaw, wallet);
              const { balance } = result;
              newBalance = balance;
            } else if (wallet.sdk === 'Ethereum') {
              newBalance = await coinSDK.getBalance(addressesRaw, wallet.network);
            } else if (wallet.sdk === 'ERC20') {
              const activeWallet = this.activeWallets[this.authenticatedAccount][wallet.name];
              newBalance = await coinSDK.getBalance(activeWallet);
            }

            // update balance
            Wallet.$update({
              where: (record) => { return record.id === wallet.id; },
              data: { confirmedBalance: parseFloat(newBalance, 10) },
            });

            resolve();
          } catch (err) {
            reject(err);
          }
        }));
      });

      try {
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
  height: 5rem!important;
}

.total-balance > div {
  margin-top: 0.2em;
}

.total-balance-wrapper {
  transition: all ease-in-out 150ms;
  position: relative;
  top: 0;
  display: block!important;
  height: 5rem!important;
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
}

.layout-shape.white {
  background: white!important;
}

.no-balance .layout-shape {
  background: #e4e9ef;
}

.background {
  transition: all ease-in-out 150ms;
}

.no-balance .background,
.short-top .background {
  height: 21rem;
}

.single-wallet-top .background {
  height: 28.5rem;
}

.q-pull-to-refresh-wrapper {
  padding-top: 2.5rem;
}

.q-pull-to-refresh-wrapper .pull-to-refresh-message {
  position: relative;
  z-index: 2
}

.coin-header-wrapper {
  height: 8rem!important;
  padding: 1rem 0.5rem;
}

.single-wallet-top .coin-header-wrapper {
  height: 10rem!important;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 0rem;
}

</style>
