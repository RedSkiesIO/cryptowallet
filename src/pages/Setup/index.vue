<template>
  <div class="setup-wrapper">
    <component :is="steps[id]"/>
  </div>
</template>

<script>
import bcrypt from 'bcryptjs';
import Language from '@/pages/Setup/Steps/Language/index.vue';
import AccountName from '@/pages/Setup/Steps/AccountName/index.vue';
import Pin from '@/pages/Setup/Steps/Pin';
import PinConfirm from '@/pages/Setup/Steps/Pin/Confirm';
import Network from '@/pages/Setup/Steps/Network';
import Restore from '@/pages/Setup/Steps/Restore';
import Seed from '@/pages/Setup/Steps/Seed';
import SeedConfirm from '@/pages/Setup/Steps/Seed/Confirm';
import Node from '@/pages/Setup/Steps/Node';
import Complete from '@/pages/Setup/Steps/Complete';
import { mapState } from 'vuex';

export default {
  components: {
    Language,
    AccountName,
    Pin,
    PinConfirm,
    Network,
    Restore,
    Seed,
    SeedConfirm,
    Node,
    Complete,
  },
  data() {
    return {
      showNext: false,
      steps: [
        Language,
        Restore,
        AccountName,
        Pin,
        PinConfirm,
        /* Network, */
        Seed,
        SeedConfirm,
        Node,
        Complete,
      ],
    };
  },
  computed: {
    ...mapState({
      id: state => parseInt(state.route.params.id, 10),
    }),
  },
  created() {
    if (this.$store.state.setup.salt) return false;
    this.$store.dispatch('setup/setSalt', bcrypt.genSaltSync(10));
    return true;
  },
};

</script>

<style>

</style>
