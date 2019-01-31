<template>
  <div class="account-item">
    <div
      class="wallet selectWallet"
      @click="clickHandler(wallet.id)"
    >
      <div class="details">
        <div class="icon">
          <img :src="coinLogo">
        </div>
        <div class="name">{{ wallet.displayName }}</div>
      </div>
      <div>

        <div v-if="clickItemAction === 'addWallet'">
          <q-toggle
            v-model="isEnabled"
          />
        </div>
      </div>

      <q-modal
        v-model="initializingModalOpened"
        minimized
        @show="enableWallet()"
      >

        <div class="initialize-wallet-modal">
          <Spinner/>
          <span>Enabling wallet</span>
        </div>
      </q-modal>

    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Wallet from '@/store/wallet/entities/wallet';
import Address from '@/store/wallet/entities/address';
import Tx from '@/store/wallet/entities/tx';
import Utxo from '@/store/wallet/entities/utxo';
import Spinner from '@/components/Spinner';
import Coin from '@/store/wallet/entities/coin';
import IconList from '@/assets/cc-icons/icons-list.json';

export default {
  name: 'WalletItem',
  components: {
    Spinner,
  },
  props: {
    wallet: {
      type: Object,
      required: true,
    },
    currency: {
      type: Object,
      required: false,
    },
    clickItemAction: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      initializingModalOpened: false,
      walletsState: [],
    };
  },
  computed: {
    ...mapState({
      authenticatedAccount: state => state.settings.authenticatedAccount,
    }),
    account() {
      return this.$store.getters['entities/account/find'](this.authenticatedAccount);
    },
    isEnabled: {
      get() {
        return this.isWalletEnabled();
      },
      set(val) {
        if (val) {
          this.enableWallet();
          // walletsState
          // this.initializingModalOpened = true;
        }
        if (!val) this.disableWallet();
      },
    },
    supportedCoins() {
      return Coin.all();
    },
    coinLogo() {
      // const coin = this.supportedCoins.find(cc => cc.name === this.wallet.name);
      /* eslint-disable-next-line */
      if(IconList.find(icon => icon.symbol === this.wallet.symbol.toUpperCase())){
        return `assets/cc-icons/color/${this.wallet.symbol.toLowerCase()}.svg`;
      }
      return 'assets/cc-icons/color/generic.svg';
    },
  },
  methods: {
    clickHandler(id) {
      switch (this.clickItemAction) {
        case 'selectWallet':
          this.$router.push({ path: `/wallet/balance/${id}` });
          break;
        case 'addWallet':
          break;
        default:
          return false;
      }
      return false;
    },

    isWalletEnabled(id) {
      const result = Wallet.query(id)
        .where('account_id', this.authenticatedAccount)
        .where('displayName', this.wallet.displayName)
        .where('name', this.wallet.name)
        .where('enabled', true)
        .get();
      return result.length > 0;
    },

    isEthEnabled(network) {
      const result = Wallet.query(network)
        .where('account_id', this.authenticatedAccount)
        .where('name', network)
        .where('enabled', true)
        .get();
      return result.length > 0;
    },

    async enableBitcoin(coinSDK, wallet, newWalletId) {
      const {
        txHistory,
        externalAccountDiscovery,
        internalAccountDiscovery,
        externalChainAddressIndex,
        internalChainAddressIndex,
        balance,
        utxos,
      } = await this.discoverWallet(wallet, coinSDK, this.wallet.network, this.wallet.sdk);

      const keyPair = coinSDK.generateKeyPair(wallet, externalChainAddressIndex);

      Wallet.$update({
        where: record => record.id === newWalletId,
        data: {
          externalChainAddressIndex,
          internalChainAddressIndex,
          confirmedBalance: balance,
          externalAddress: keyPair.address,
        },
      });

      const newAddress = {
        account_id: this.authenticatedAccount,
        wallet_id: newWalletId,
        chain: 'external',
        address: keyPair.address,
        index: externalChainAddressIndex,
      };

      await Address.$insert({ data: newAddress });

      const unconfirmedTx = [];
      const confirmedTx = [];

      txHistory.txs.forEach((tx) => {
        tx.account_id = this.authenticatedAccount;
        tx.wallet_id = newWalletId;
        if (tx.confirmed) confirmedTx.push(tx);
        if (!tx.confirmed) unconfirmedTx.push(tx);
      });

      utxos.forEach((utxo) => {
        utxo.account_id = this.authenticatedAccount;
        utxo.wallet_id = newWalletId;
        Utxo.$insert({ data: utxo });
      });

      function createDate(timestamp) {
        return new Date(timestamp * 1000).getTime();
      }

      const allTx = [...unconfirmedTx, ...confirmedTx];
      allTx.sort((a, b) => createDate(b.receivedTime) - createDate(a.receivedTime));

      allTx.forEach(async (tx) => {
        await Tx.$insert({ data: tx });
      });

      externalAccountDiscovery.active.forEach(async (address) => {
        address.account_id = this.authenticatedAccount;
        address.wallet_id = newWalletId;
        address.chain = 'external';
        address.hash = address.address;
        address.index = address.index;
        await Address.$insert({ data: address });
      });

      internalAccountDiscovery.used.forEach(async (address) => {
        address.account_id = this.authenticatedAccount;
        address.wallet_id = newWalletId;
        address.chain = 'internal';
        address.hash = address.address;
        address.index = address.index;
        await Address.$insert({ data: address });
      });
    },

    /*eslint-disable*/
    async enableEthereum(coinSDK, wallet, newWalletId) {
      const {
        txHistory,
        accounts,
        balance,
      } = await this.discoverWallet(wallet, coinSDK, this.wallet.network, this.wallet.sdk);

      Wallet.$update({
        where: record => record.id === newWalletId,
        data: {
          externalChainAddressIndex: 0,
          internalChainAddressIndex: 0,
          confirmedBalance: balance,
          externalAddress: accounts[0].address,
        },
      });

      const newAddress = {
        account_id: this.authenticatedAccount,
        wallet_id: newWalletId,
        chain: 'external',
        address: accounts[0].address,
        index: 0,
      };

      await Address.$insert({ data: newAddress });

      const unconfirmedTx = [];
      const confirmedTx = [];

      txHistory.txs.forEach((tx) => {
        tx.account_id = this.authenticatedAccount;
        tx.wallet_id = newWalletId;
        if (tx.confirmed) confirmedTx.push(tx);
        if (!tx.confirmed) unconfirmedTx.push(tx);
      });

      function createDate(timestamp) {
        return new Date(timestamp * 1000).getTime();
      }

      const allTx = [...unconfirmedTx, ...confirmedTx];
      allTx.sort((a, b) => createDate(b.confirmedTime) - createDate(a.confirmedTime));

      allTx.forEach(async (tx) => {
        await Tx.$insert({ data: tx });
      });


      console.log(txHistory, accounts, balance);


    },

    async enableWallet() {
      console.log('enable wallet');
    if(this.wallet.sdk === 'ERC20' && !this.isEthEnabled(this.wallet.parentName)){
      const eth = this.supportedCoins.find(coin => coin.name === this.wallet.networkName);

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
  
      const data = {
        name: this.wallet.name,
        displayName: this.wallet.displayName,
        sdk: this.wallet.sdk,
        account_id: this.authenticatedAccount,
        network: this.wallet.network,
        symbol: this.wallet.symbol,
      };
      
      /*const coinSDK = this.coinSDKS[this.wallet.sdk];
      const wallet = coinSDK.generateHDWallet(this.account.seed.join(' ').trim(), this.wallet.network);
      this.activeWallets[this.authenticatedAccount][this.wallet.name] = wallet;*/

      const newWalletResult = await Wallet.$insert({ data });
      const newWalletId = newWalletResult.wallet[0].id;

      /*if (this.wallet.sdk === 'Bitcoin') await this.enableBitcoin(coinSDK, wallet, newWalletId);
      if (this.wallet.sdk === 'Ethereum') await this.enableEthereum(coinSDK, wallet, newWalletId);*/

      //this.initializingModalOpened = false;

      await Wallet.$update({
        where: record => record.id === newWalletId,
        data: { imported: false, enabled: true },
      });
      if(this.wallet.sdk === 'ERC20'){
        const eth = this.supportedCoins.find(coin => coin.name === this.wallet.parentName);
        await Wallet.$update({
        where: record => record.id === newWalletId,
        data: { parentSdk: eth.sdk, 
                parentName: eth.name,
                contractAddress: this.wallet.contractAddress,
                decimals: this.wallet.decimals,
              },
      });
      }
    },

    disableWallet() {
      const walletIds = [];
      if(this.wallet.sdk === 'Ethereum'){
        const erc20Wallets = Wallet.query()
        .where('account_id', this.authenticatedAccount)
        .where('sdk', 'ERC20')
        .get();
        
        erc20Wallets.forEach((wallet) => {
          walletIds.push(wallet.id)
        })
      }
      const wallets = Wallet.query()
        .where('account_id', this.authenticatedAccount)
        .where('displayName', this.wallet.displayName)
        .where('name', this.wallet.name)
        .get();

      walletIds.push(wallets[0].id);

      walletIds.forEach((walletId)=> {

      
      Wallet.$delete(walletId);


      Wallet.$update({
        where: record => record.id === walletId,
        data: { imported: false, enabled: false },
      });

      const transactions = Tx.query().where('wallet_id', walletId).get();
      transactions.forEach((tx) => {
        Tx.$delete(tx.id);
      });

      const utxos = Utxo.query().where('wallet_id', walletId).get();
      utxos.forEach((tx) => {
        Utxo.$delete(tx.id);
      });

      const addresses = Address.query().where('wallet_id', walletId).get();
      addresses.forEach((address) => {
        Address.$delete(address.id);
      });
      });
    },
  },
};
</script>

<style scoped>
.selectWallet {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.selectWallet .details {
  display: flex;
  align-items: center;
}

.icon {
  border-radius:100%;
  width: 2.5rem;
  height: 2.5rem;
  margin-right: 1rem;
}

.icon img {
  width: 100%;
  height: 100%;
}

.initialize-wallet-modal {
  padding: 1em 1em;
  display: flex;
  align-items: center;
  justify-content: space-around;
  font-size: 1em;
}
</style>
