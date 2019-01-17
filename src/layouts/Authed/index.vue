<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <Header/>
    </q-layout-header>

    <div class="q-pull-to-refresh-wrapper">
      <q-pull-to-refresh
        :handler="refresher"
        :disable="isPullDisabled"
        color="cyan"
      >

        <div class="background"/>
        <div
          :class="{ 'no-footer': !isMainNavVisible }"
          class="layout-wrapper"
        >

          <div
            v-if="showTotalBalance"
            class="total-balance"
          >
            <div>{{ totalBalance }}</div>
          </div>

          <div class="layout-shape">
            <router-view/>
          </div>
        </div>

      </q-pull-to-refresh>
    </div>

    <transition
      enter-active-class="animated slideInUp"
      leave-active-class="animated slideOutDown"
    >
      <q-layout-footer v-show="isMainNavVisible">
        <MainNav/>
      </q-layout-footer>
    </transition>
  </q-layout>
</template>

<script>
import { mapState } from 'vuex';
import Wallet from '@/store/wallet/entities/wallet';
import AmountFormatter from '@/helpers/AmountFormatter';
import MainNav from '@/layouts/MainNav';
import Header from '@/layouts/Header';

import Address from '@/store/wallet/entities/address';
import Utxo from '@/store/wallet/entities/utxo';

export default {
  name: 'AuthedLayout',
  components: {
    MainNav,
    Header,
  },

  data() {
    return {
      isMainNavVisible: false,
      isPullDisabled: false,
      transitionName: 'slide-left',
    };
  },

  computed: {
    ...mapState({
      isSearchingContacts: state => state.search.isSearchingContacts,
      authenticatedAccount: state => state.settings.authenticatedAccount,
    }),
    wallets() {
      return Wallet.query().where('account_id', this.authenticatedAccount).get();
    },
    selectedCurrency() {
      return this.$store.state.settings.selectedCurrency;
    },
    totalBalance() {
      let balance = 0;

      console.log('totalBalance', this.wallets);

      this.wallets.forEach((wallet) => {
        const formattedAmount = new AmountFormatter({
          amount: wallet.confirmedBalance,
          format: '0.00',
          coin: wallet.name,
          prependPlusOrMinus: false,
          currency: this.selectedCurrency,
          toCurrency: true,
          toCoin: false,
          withCurrencySymbol: false,
        });

        balance += parseFloat(formattedAmount.getFormatted());
      });

      const formattedBalance = new AmountFormatter({
        amount: balance,
        format: '0.00',
        currency: this.selectedCurrency,
        toCurrency: false,
        toCoin: false,
        withCurrencySymbol: true,
      });

      return formattedBalance.getFormatted();
    },
    showTotalBalance() {
      return this.$route.name === 'wallet' ||
             this.$route.name === 'sendCoin' ||
             this.$route.name === 'receiveCoin' ||
             this.$route.name === 'coinHistory' ||
             this.$route.name === 'coinPrices';
    },
  },

  watch: {
    /**
     * Watch the $route to keep the MainNav visibility updated
     */
    '$route.path': {
      handler() {
        this.updateMainNavVisibility();
        this.updateIsPullDisabled();
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
    this.updateIsPullDisabled();
  },
  methods: {
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

    updateIsPullDisabled() {
      this.isPullDisabled = this.$route.name !== 'wallet';
    },

    refresher(done) {
      if (this.$route.name === 'wallet') this.updateBalances(done);
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

    updateBalances(done) {
      const promises = [];

      this.wallets.forEach((wallet) => {
        promises.push(new Promise(async (resolve) => {
          const coinSDK = this.coinSDKS[wallet.sdk];

          const addresses = Address.query()
            .where('account_id', this.authenticatedAccount)
            .where('wallet_id', wallet.id)
            .where('used', false)
            .get();

          let addressesRaw = addresses.map(item => item.address);

          function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
          }

          addressesRaw = addressesRaw.filter(onlyUnique);

          let newBalance;
          if (wallet.sdk === 'Bitcoin') {
            const result = await this.getUtxos(addressesRaw, wallet);
            const { balance } = result;
            newBalance = balance;
          } else if (wallet.sdk === 'Ethereum') {
            newBalance = await coinSDK.getBalance(addressesRaw, wallet.network);
          }

          // update balance
          Wallet.$update({
            where: record => record.id === wallet.id,
            data: { confirmedBalance: parseFloat(newBalance, 10) },
          });

          resolve();
        }));
      });

      Promise.all(promises).then(() => {
        done();
      });
    },
  },
};
</script>

<style>
.animated {
  animation-duration: 250ms;
}

.total-balance {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-family: 'CooperHewitt-SemiboldItalic';
  font-size: 2rem;
  line-height: 1;
  text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.5);
  height: 6rem!important;
}

.total-balance > div {
  margin-top: 0.2em;
}

.q-pull-to-refresh-wrapper {
  padding-top: 2.5rem;
}

.q-pull-to-refresh-wrapper .pull-to-refresh-message {
  position: relative;
  z-index: 2
}

</style>
