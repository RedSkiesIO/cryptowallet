<template>
  <div>
    <div>
      <div>
        <h1>{{ $t("nodeTitle") }}</h1>
      </div>
      <div>
        {{ $t("nodeSubtitle") }}
      </div>
      <q-input v-model="nodeIp" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {

  data() {
    return {
      nodeIp: null,
    };
  },

  ...mapState({
    spvModeState: state => state.setup.spvMode,
  }),

  watch: {
    nodeIp(ip) {
      if (this.validIp(ip)) {
        this.$store.dispatch('setup/setAccountIpNode', ip);
        this.$root.$emit('showNext');
      }
    },
  },

  methods: {
    validate() {
      // @TODO run a socket check to make sure the node is availble
      return true;
    },

    validIp(ip) {
      if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip)) {
        return true;
      }
      return false;
    },

    openInNewTab() {
      this.$store.dispatch('setup/setSPVmode', 'false');
      const win = window.open('https://atlascity.io/run-a-node/', '_blank');
      win.focus();
    },
  },

};

</script>
