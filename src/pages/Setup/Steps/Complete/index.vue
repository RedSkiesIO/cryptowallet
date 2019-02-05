<template>
  <div/>
</template>

<script>
import { uid } from 'quasar';
import { mapState } from 'vuex';
import Account from '@/store/wallet/entities/account';

export default {
  computed: {
    ...mapState({
      setup: state => state.setup,
    }),
  },
  mounted() {
    this.complete();
  },
  methods: {
    /**
     * complete setup and store account entity.
     */
    async complete() {
      const accounts = this.$store.getters['entities/account/query']().get();

      const data = {
        uid: uid(),
        name: this.setup.accountName,
        salt: this.setup.salt,
        pinHash: this.setup.pinHash,
        default: accounts.length === 0,
        locale: this.setup.accountLocale || this.$i18n.locale,
        node: this.setup.accountIpNode,
        seed: Object.values(this.setup.seed),
        currency: 'GBP',
      };

      console.log('inserting account', data);

      this.$store.dispatch('settings/setSelectedAccount', data.name);
      const password = this.setup.pinArray.join('');

      const result = await Account.$insert({
        data,
        password,
      });

      const { id } = result.account[0];

      this.$store.dispatch('settings/setAuthenticatedAccount', id);
      this.$store.dispatch('settings/setLayout', 'light');
      this.$router.push({ path: '/wallet' });
      this.$store.dispatch('settings/clearSetupData');
    },
  },
};
</script>

<style>

</style>
