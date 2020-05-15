<template>
  <div class="filter-wallets">
    <q-select
      v-model="model"
      autofocus
      borderless
      use-input
      hide-selected
      dense
      hide-dropdown-icon
      :placeholder="$t('searchTokens')"
      input-debounce="0"
      content-class="token-select"
      content-style="background: none;"
      behavior="menu"
      :options="options"
      @filter="filterFn"
    >
      <template v-slot:prepend>
        <q-icon
          color="white"
          name="search"
          style="margin-left: 1rem"
        />
      </template>

      <template
        v-slot:option="scope"
        class="bg-blueish"
      >
        <div class="bg-blueish">
          <WalletItem
            :wallet="scope.opt"
          />
        </div>
      </template>

      <template v-slot:no-option>
        <q-item>
          <q-item-section
            class="text-grey"
            style="padding: 0 1rem"
          >
            {{ $t('noWalletsFound') }}
          </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>

<script>
import WalletItem from '@/components/Wallet/WalletItem';
import Coin from '@/store/wallet/entities/coin';

export default {
  name: 'WalletsFilter',
  components: {
    WalletItem,
  },
  data() {
    return {
      model: null,
      options: Coin.all(),
    };
  },

  computed: {
    wallets() {
      return Coin.all();
    },
  },

  methods: {
    filterFn(val, update) {
      const getUnique = (arr, comp) => {
        const unique = arr
          .map((e) => { return e[comp]; })
          .map((e, i, final) => { return final.indexOf(e) === i && i; })
          .filter((e) => { return arr[e]; }).map((e) => { return arr[e]; });
        return unique;
      };

      update(() => {
        const needle = val.toLowerCase();
        const filterByName = this.wallets.filter((wallet) => {
          return wallet.name.toLowerCase().indexOf(needle) > -1;
        });
        const filterBySymbol = this.wallets.filter((wallet) => {
          return wallet.symbol.toLowerCase().indexOf(needle) > -1;
        });
        this.options = getUnique([...filterByName, ...filterBySymbol], '$id');
      });
    },
  },
};
</script>
<style>
.q-menu {
  background: none;
  box-shadow: none;
}
</style>
