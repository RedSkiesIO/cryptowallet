<template>
  <div>
    <h1 class="setup">
      Seed Phrase
    </h1>
    <p class="setup">
      {{ $t('writeSeed') }}
    </p>
    <h4 class="setup seed-box">
      <span
        v-for="(word, i) in seedPhrase"
        :key="`word${i}`"
        class="word-span"
      >
        <span class="word-index">{{ i + 1 }}.</span>
        {{ word }}
      </span>
    </h4>

    <div class="btns-wrapper">
      <q-btn
        color="secondary"
        label="Try Different Seed"
        @click="generateSeed"
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
import bip39 from 'bip39';
import { mapState } from 'vuex';

export default {
  data() {
    return {
      generateble: true,
      seedPhrase: [],
      valid: false,
    };
  },
  computed: {
    ...mapState({
      id: (state) => { return parseInt(state.route.params.id, 10); },
    }),
  },
  mounted() {
    this.generateSeed();
  },
  methods: {
    generateSeed() {
      this.seedPhrase = bip39.generateMnemonic().split(' ');
      console.log(this.seedPhrase);
      this.$store.dispatch('setup/setSeed', this.seedPhrase);
    },
    done() {
      this.$q.dialog({
        title: 'Confirm',
        message: 'Have you stored your seed?',
        ok: 'Yes',
        cancel: 'No',
        color: 'blueish',
      }).then(() => {
        this.$router.push({ path: `/setup/${this.id + 1}` });
      }).catch(() => {
        this.closeModal();
      });
    },
    anotherSeed() {
      this.generateSeed();
    },
  },
};
</script>

<style scoped>
.seed-box {
  padding: 1em 0;
  line-height: 2;
  font-size: 1.2rem;
}

.word-span {
  margin: 0 .5em;
  display: inline-block;
}

.word-index {
  opacity: 0.3;
  white-space: nowrap;
  font-size: 0.75em;
}
</style>
