<template>
  <section>
    <div>
      <h1 id="title_id">{{ $t('setupTitle') }}</h1>
      <br>
      <span id="subtitle_id">
        {{ $t('writeSeed') }}
      </span>
      <span id="subtitle_id">
        {{ $t('clickSeed') }}
      </span>
      <q-btn
        v-if="generateble"
        :label="`generate`"
        style="color: goldenrod;"
        outline
        @click="generateSeed"
      />
      <div class="seedContainer">
        <span
          v-for="(word, i) in seedPhrase"
          :key="`word${i}`"
          style="color: goldenrod;"
        > {{ word }}
        </span>
      </div>
    </div>
  </section>
</template>

<script>
import bip39 from 'bip39';

export default {

  data() {
    return {
      generateble: true,
      seedPhrase: [],
      valid: false,
    };
  },

  methods: {
    validate() {
      if (Array.isArray(this.seedPhrase) && this.seedPhrase.length === 12) {
        this.$store.dispatch('setup/setSeed', this.seedPhrase);
        this.valid = true;
      } else {
        this.$toast.create(10, this.$t('pinLengthError'), 500);
        this.valid = false;
      }
      return this.valid;
    },

    generateSeed() {
      while (this.seedPhrase.length < 12) {
        this.seedPhrase = bip39.generateMnemonic().split(' ');
      }
      this.generateble = false;
      console.log(this.seedPhrase);
      this.$root.$emit('showNext');
    },
  },
};
</script>
