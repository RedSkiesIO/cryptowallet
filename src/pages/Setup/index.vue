<template>
  <div class="setup-wrapper">
    <component :is="steps[id]"/>
  </div>
</template>

<script>
/* eslint-disable */
import bcrypt from 'bcryptjs';
import { FormWizard, TabContent } from 'vue-form-wizard';
import 'vue-form-wizard/dist/vue-form-wizard.min.css';
import Language from '@/pages/Setup/Steps/Language/index.vue';
import AccountName from '@/pages/Setup/Steps/AccountName/index.vue';
import Pin from '@/pages/Setup/Steps/Pin';
import PinConfirm from '@/pages/Setup/Steps/Pin/Confirm';
import Network from '@/pages/Setup/Steps/Network';
import Seed from '@/pages/Setup/Steps/Seed';
import SeedConfirm from '@/pages/Setup/Steps/Seed/Confirm';
import Node from '@/pages/Setup/Steps/Node';
import Complete from '@/pages/Setup/Steps/Complete';
import { mapState } from 'vuex';

export default {
  components: {
    FormWizard,
    TabContent,
    Language,
    AccountName,
    Pin,
    PinConfirm,
    Network,
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
        AccountName,
        Pin,
        PinConfirm,
        /*Network,*/
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
    /**
     * @todo
     */
    if (this.$store.state.setup.salt) return false;
    this.$store.dispatch('setup/setSalt', bcrypt.genSaltSync(10));
  },
  methods: {
/*    afterChange(prevIndex, nextIndex) {
      this.showNext = false;
      if (nextIndex === 1) this.$store.dispatch('setup/resetPin', {value: []});
      if (nextIndex === 2) this.$store.dispatch('setup/resetPinConfirm', {value: []});
      if (nextIndex === 3) this.showNext = true;
    },

    validateStep(name) {
      if (this.$refs[name].validate() === true) {
        this.validStep = true;
      } else {
        return false;
      }
      return true;
    },*/
  },
};

</script>

<style>

</style>
