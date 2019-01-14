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

      /*eslint-disable*/

      const data = {
        uid: uid(),
        name: this.setup.accountName,
        salt: this.setup.salt,
        pinHash: this.setup.pinHash,
        default: accounts.length === 0,
        locale: this.setup.accountLocale,
        node: this.setup.accountIpNode,
        seed: Object.values(this.setup.seed),
        //seed: 'domain bunker surround uncle cotton day giraffe kiss mutual bean onion few'.split(),
        // seed: 'calm steel soccer pulse polar depend bar bargain give pave ancient member'.split(),
        //seed: 'nut mixture license bean page mimic iron spice rail uncover then warfare'.split(' '),
      };


/*

0: "pioneer"
​
1: "silent"
​
2: "bacon"
​
3: "verify"
​
4: "walk"
​
5: "tiger"
​
6: "congress"
​
7: "alert"
​
8: "fox"
​
9: "antenna"
​
10: "execute"
​
11: "diamond"

 */


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
