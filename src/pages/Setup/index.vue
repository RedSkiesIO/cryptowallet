<template>
  <div>
    <form-wizard
      ref="wizard"
      step-size="xs"
      @on-change="()=>afterChange()"
    >
      <tab-content
        :before-change="()=>validateStep('language')"
        title=" Language"
        icon="ti-user">
        <language ref="language" />
      </tab-content>
      <tab-content
        :before-change="()=>validateStep('accountName')"
        title=" AccountName"
        icon="ti-user">
        <AccountName ref="accountName" />
      </tab-content>
      <tab-content
        :before-change="()=>validateStep('pin')"
        title="Pin"
        icon="ti-settings">
        <pin ref="pin" />
      </tab-content>
      <tab-content
        :before-change="()=>validateStep('pinConfirm')"
        title="Repeat Pin"
        icon="ti-settings">
        <pin-confirm ref="pinConfirm" />
      </tab-content>
      <tab-content
        :before-change="()=>validateStep('seed')"
        title="Seed"
        icon="ti-settings"
      >
        <seed ref="seed" />
      </tab-content>
      <tab-content
        :before-change="()=>validateStep('seedConfirm')"
        title="Repeat Seed"
        icon="ti-settings">
        <seed-confirm ref="seedConfirm" />
      </tab-content>
      <tab-content
        :before-change="()=>validateStep('node')"
        title="Node"
        icon="ti-settings">
        <node ref="node" />
      </tab-content>
      <tab-content
        title="Final"
        icon="ti-check"
      >
        <complete />
      </tab-content>
      <template
        slot="footer"
        slot-scope="{activeTabIndex,isLastStep, nextTab, prevTab, fillButtonStyle}">
        <div class="wizard-footer-left">
          <q-btn
            v-if="activeTabIndex > 0"
            :label="$t('back')"
            style="color: goldenrod;"
            outline
            @click="prevTab"
          />
        </div>
        <div class="wizard-footer-right">
          <q-btn
            v-if="showNext && !isLastStep"
            :label="$t('continue')"
            style="color: goldenrod;"
            outline
            @click="nextTab"
          />
        </div>
      </template>
    </form-wizard>
  </div>
</template>

<script>
import bcrypt from 'bcryptjs';
import { FormWizard, TabContent } from 'vue-form-wizard';
import 'vue-form-wizard/dist/vue-form-wizard.min.css';
import Language from '@/pages/Setup/Steps/Language/index.vue';
import AccountName from '@/pages/Setup/Steps/AccountName/index.vue';
import Pin from '@/pages/Setup/Steps/Pin';
import PinConfirm from '@/pages/Setup/Steps/Pin/Confirm';
import Seed from '@/pages/Setup/Steps/Seed';
import SeedConfirm from '@/pages/Setup/Steps/Seed/Confirm';
import Node from '@/pages/Setup/Steps/Node';
import Complete from '@/pages/Setup/Steps/Complete';

export default {

  components: {
    FormWizard,
    TabContent,
    Language,
    AccountName,
    Pin,
    PinConfirm,
    Seed,
    SeedConfirm,
    Node,
    Complete,
  },

  data() {
    return {
      showNext: false,
    };
  },

  created() {
    this.$store.dispatch('setup/setSalt', bcrypt.genSaltSync(10));
  },

  mounted() {
    this.$root.$on('showNext', () => {
      this.showNext = true;
    });
    this.$root.$on('hideNext', () => {
      this.showNext = false;
    });
  },

  methods: {
    afterChange() {
      this.showNext = false;
    },

    validateStep(name) {
      if (this.$refs[name].validate() === true) {
        this.validStep = true;
      } else {
        return false;
      }
      return true;
    },
  },
};

</script>

<style scoped>
.wizard-nav .wizard-nav-pills {
  display: none;
}
</style>
