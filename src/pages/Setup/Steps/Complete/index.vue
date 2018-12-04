<template>
  <div>
    <q-btn
      :label="$t('complete')"
      style="color: goldenrod;"
      outline
      @click="complete"
    />
  </div>
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

  methods: {
    /**
     * complete setup and store account entity.
     */
    complete() {
      const accounts = this.$store.getters['entities/account/query']().get();

      const data = {
        uid: uid(),
        name: this.setup.accountName,
        salt: this.setup.salt,
        pinHash: this.setup.pinHash,
        default: accounts.length === 0,
        locale: this.setup.accountLocale,
        node: this.setup.accountIpNode,
        seed: Object.values(this.setup.seed),
      };

      this.$store.dispatch('settings/setSelectedAccount', data.name);

      Account.$insert({ data })
        .then(() => {
          this.$router.push({ path: '/' });
        });
    },
  },
};
</script>

<style scoped>
</style>
