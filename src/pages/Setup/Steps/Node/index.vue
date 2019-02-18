<template>
  <div>
    <h1 class="setup">{{ $t("nodeTitle") }}</h1>
    <p class="setup">{{ $t("nodeSubtitle") }}</p>

    <div class="ip-input">
      <q-input
        :float-label="$t('IPAddress')"
        v-model="nodeIp"
        inverted
        color="blueish"
      />
    </div>

    <div class="btns-wrapper">
      <q-btn
        color="secondary"
        label="Skip"
        @click="skip"
      />

      <q-btn
        color="yellow"
        text-color="blueish"
        label="Done"
        @click="done"
      />
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
  computed: {
    ...mapState({
      spvModeState: (state) => { return state.setup.spvMode; },
      id: (state) => { return parseInt(state.route.params.id, 10); },
    }),
  },
  methods: {
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

    done() {
      if (this.validIp(this.nodeIp)) {
        this.$router.push({ path: `/setup/${this.id + 1}` });
      } else {
        this.$toast.create(10, this.$t('invalidIpAddress'), 500);
      }
    },

    skip() {
      this.$router.push({ path: `/setup/${this.id + 1}` });
    },
  },

};

</script>

<style>
.ip-input {
  margin-top: 1em;
  padding: 0 1em;
}
</style>
