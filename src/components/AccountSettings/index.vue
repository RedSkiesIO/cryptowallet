<template>
  <div>
    <div
      class="settings-row"
      @click="changeLanguage"
    >
      <div>
        {{ $t('language') }}
      </div>
      <div>
        <q-btn
          icon="chevron_right"
          size="lg"
          color="blueish"
          class="settings-chevron"
          flat
          @click="changeLanguage"
        />
      </div>
    </div>

    <div
      class="settings-row"
      @click="changeCurrency"
    >
      <div>
        {{ $t('currency') }}
      </div>
      <div>
        <q-btn
          icon="chevron_right"
          size="lg"
          color="blueish"
          class="settings-chevron"
          flat
          @click="changeCurrency"
        />
      </div>
    </div>

    <div
      class="settings-row"
      @click="changeNodeIP"
    >
      <div>
        Atlas Node
      </div>
      <div>
        <q-btn
          icon="chevron_right"
          size="lg"
          color="blueish"
          class="settings-chevron"
          flat
          @click="changeNodeIP"
        />
      </div>
    </div>

    <div
      class="settings-row"
      @click="changePin"
    >
      <div>
        {{ $t('pinCode') }}
      </div>
      <div>
        <q-btn
          icon="chevron_right"
          size="lg"
          color="blueish"
          class="settings-chevron"
          flat
          @click="changePin"
        />
      </div>
    </div>

    <div
      class="settings-row"
      @click="logout"
    >
      <div>
        {{ $t('logout') }}
      </div>
      <div>
        <q-btn
          icon="chevron_right"
          size="lg"
          color="blueish"
          class="settings-chevron"
          flat
          @click="logout"
        />
      </div>
    </div>

    <div
      class="settings-row"
      @click="deleteAccount"
    >
      <div>
        {{ $t('deleteAccount') }}
      </div>
      <div>
        <q-btn
          icon="chevron_right"
          size="lg"
          color="blueish"
          class="settings-chevron"
          flat
          @click="deleteAccount"
        />
      </div>
    </div>

    <SelectLanguage
      :open="languageOpen"
      :current-locale="account.locale"
      @closeLanguageModal="languageOpen=false"
    />

    <SelectCurrency
      :open="currencyOpen"
      :current-currency="account.currency"
      @closeCurrencyModal="currencyOpen=false"
    />

    <Node
      :open="nodeOpen"
      :current="nodeIp"
      @closeNodeModal="nodeOpen=false"
    />

    <Pin
      :open="pinOpen"
      :pin-hash="account.pinHash"
      @closePinModal="pinOpen=false"
    />

    <DeleteAccount
      :open="deleteAccountOpen"
      :pin-hash="account.pinHash"
      @closePinModal="deleteAccountOpen=false"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import SelectLanguage from '@/components/AccountSettings/SelectLanguage';
import SelectCurrency from '@/components/AccountSettings/SelectCurrency';
import Node from '@/components/AccountSettings/Node';
import Pin from '@/components/AccountSettings/Pin';
import DeleteAccount from '@/components/AccountSettings/DeleteAccount';
import Account from '@/store/wallet/entities/account';
import Wallet from '@/store/wallet/entities/wallet';

export default {
  name: 'AccountSettings',
  components: {
    SelectLanguage,
    SelectCurrency,
    Node,
    Pin,
    DeleteAccount,
  },
  data() {
    return {
      languageOpen: false,
      nodeOpen: false,
      pinOpen: false,
      deleteAccountOpen: false,
      currencyOpen: false,
    };
  },
  computed: {
    ...mapState({
      authenticatedAccount: (state) => {
        return state.settings.authenticatedAccount;
      },
    }),
    account() {
      return this.$store.getters['entities/account/find'](this.authenticatedAccount);
    },
    nodeIp() {
      return this.account.node || '';
    },
  },
  methods: {
    async logout() {
      try {
        const accountDataLoki = await Account.$find(this.account.id);
        const encryptedSeed = accountDataLoki[0].seed;

        Account.update({
          where: (record) => { return record.id === this.account.id; },
          data: { seed: encryptedSeed },
        });

        const wallets = await Wallet.query().where('account_id', this.account.id).get();
        const promises = [];
        wallets.forEach((wallet) => {
          promises.push(new Promise(async (res) => {
            const walletDataLoki = await Wallet.$find(wallet.id);
            const encryptedData = walletDataLoki[0].hdWallet;

            Wallet.update({
              where: (record) => { return record.name === wallet.name; },
              data: { hdWallet: encryptedData },
            });
            res();
          }));
        });

        await Promise.all(promises);

        this.$store.dispatch('settings/setLoading', true);
        this.$store.dispatch('settings/setLayout', 'dark');
        this.$router.push({ path: '/' });
        this.$store.dispatch('settings/setAuthenticatedAccount', null);
        setTimeout(() => {
          this.$store.dispatch('settings/setLoading', false);
        }, 250);
      } catch (err) {
        this.errorHandler(err);
      }
    },
    changeLanguage() {
      this.languageOpen = true;
    },
    changeNodeIP() {
      this.nodeOpen = true;
    },
    changePin() {
      this.pinOpen = true;
    },
    deleteAccount() {
      this.deleteAccountOpen = true;
    },
    changeCurrency() {
      this.currencyOpen = true;
    },
  },
};
</script>

<style>
.settings-row {
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid whitesmoke;
  height: 3.5rem;
  display: flex;
  align-items: center;
  font-family: 'Montserrat-Medium';
}

.settings-chevron {
  height: 2em!important;
  min-height: auto;
  padding: 0;
  padding-left: 2em;
  position: relative;
  right: -0.25em;
}

.settings-chevron .q-btn-inner {
  justify-content: flex-end;
}

</style>
