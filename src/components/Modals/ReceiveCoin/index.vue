<template>
  <div>
    <q-modal
      v-model="receiveCoinModalOpened"
      class="light-modal modal"
    >
      <div class="header-section">
        <div class="header-back-button-wrapper">
          <q-btn
            icon="arrow_back"
            size="lg"
            class="icon-btn back-arrow-btn"
            flat
            @click.prevent="goBack"
          />
        </div>
        <h1 class="header-h1">Receive</h1>
      </div>
      <div
        v-if="wallet"
        class="modal-layout-wrapper"
      >
        <Receive/>
      </div>
    </q-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Receive from '@/components/Wallet/ReceiveCoin';

export default {
  name: 'ReceiveCoin',
  components: {
    Receive,
  },
  data() {
    return {
      receiveCoinModalOpened: false,
    };
  },
  computed: {
    ...mapState({
      id: state => state.route.params.id,
      authenticatedAccount: state => state.settings.authenticatedAccount,
    }),
    wallet() {
      return this.$store.getters['entities/wallet/find'](this.id);
    },
  },
  watch: {
    $route: {
      handler(to) {
        if (to.name === 'receiveCoin') {
          this.receiveCoinModalOpened = true;
        } else {
          this.receiveCoinModalOpened = false;
        }
      },
    },
    receiveCoinModalOpened: {
      handler(newVal, oldVal) {
        if (oldVal === true && newVal === false) {
          if (this.$store.state.route.name === 'receiveCoin') this.$router.go(-1);
        }
      },
    },
  },
  mounted() {
    this.$root.$on('receiveCoinModalOpened', (value) => {
      this.receiveCoinModalOpened = value;
    });
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style>
</style>
