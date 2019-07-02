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
      placeholder="Search Tokens"
      input-debounce="0"
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

      <template v-slot:option="scope">
        <WalletItem
          :wallet="scope.opt"
        />
      </template>

      <template v-slot:no-option>
        <q-item>
          <q-item-section
            class="text-grey"
            style="padding: 0 1rem"
          >
            No results
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
    walletNames() {
      return Coin.all().map((coin) => {
        return coin.name;
      });
    },
  },

  methods: {
    filterFn(val, update) {
      update(() => {
        const needle = val.toLowerCase();
        this.options = this.wallets.filter((wallet) => {
          return wallet.name.toLowerCase().indexOf(needle) > -1;
        });
      });
    },
  },
};
</script>
