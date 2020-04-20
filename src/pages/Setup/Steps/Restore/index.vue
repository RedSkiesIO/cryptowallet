<template>
  <div>
    <div class="container">
      <div class="restore-header">
        <h1 class="setup">
          {{ $t('restoreAccount') }}
        </h1>
        <p class="setup">
          {{ $t('restoreDescription') }}
        </p>
      </div>

      <div class="restore-input-wrapper">
        <q-input
          v-model="seedPhrase"
          type="textarea"
          float-label="Backup Phrase"
          outlined
          dark
          color="primary"
        />
      </div>
    </div>
    <div class="btns-wrapper">
      <q-btn
        color="primary"
        text-color="blueish"
        label="Next"
        @click="validate"
      />
    </div>
    <div
      class="qr-button-wrapper"
    >
      <q-btn
        icon="fas fa-qrcode"
        color="primary"
        size="lg"
        class="icon-btn"
        flat
        @click="scan"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import bip39 from 'bip39';

export default {
  name: 'Restore',
  data() {
    return {
      seedPhrase: '',
    };
  },
  computed: {
    ...mapState({
      delay: (state) => { return state.settings.delay; },

    }),
  },
  methods: {
    validate() {
      const twelve = 12;
      const fifteen = 15;
      const eighteen = 18;
      const twentyone = 21;
      const twentyfour = 24;
      const seedLengths = [twelve, fifteen, eighteen, twentyone, twentyfour];
      const lowercase = this.seedPhrase.toLowerCase();
      const seedPhrase = lowercase.trim().split(' ');

      if (!seedLengths.includes(seedPhrase.length)) {
        this.$toast.create(10, this.$t('notEnoughWords'), this.delay.normal);
        return false;
      }

      if (!bip39.validateMnemonic(seedPhrase.join(' '))) {
        this.$toast.create(10, this.$t('invalidSeedPhrase'), this.delay.normal);
        return false;
      }

      this.$store.dispatch('setup/setSeed', seedPhrase);
      this.$router.push({ path: '/setup/4' });
      return true;
    },

    /**
     * Initiates the QR code scanner
     */
    scan() {
      this.$store.dispatch('qrcode/setQRMode', 'restore');
      this.$store.dispatch('qrcode/scanQRCode');

      setTimeout(() => {
        this.codeReader
          .decodeOnceFromVideoDevice(undefined, 'video')
          .then((result) => {
            const { text } = result;

            this.seedPhrase = text;
            const valid = this.validate();
            if (!valid) { this.seedPhrase = ''; }
            this.codeReader.reset();

            this.$store.dispatch('qrcode/cancelScanning');
          })
          .catch((err) => { return console.error(err); });
        this.codeReader.reset();
      }, this.delay.normal);
    },
  },
};

</script>

<style scoped>
.restore-input-wrapper {
  margin-top: 1rem;
  padding: 0 1em;
}

.qr-button-wrapper {
  display: flex;
  height: 100%;
  justify-content: space-around;
}
</style>
