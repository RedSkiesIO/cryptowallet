<template>
  <div>
    <h1 class="setup">{{ $t('confirmSeed') }}</h1>
    <p class="setup">
      {{ $t('pressSeed') }}
    </p>
    <div class="randomSeedContainer">
      <q-btn
        v-for="(word, i) in shuffledSeed"
        :key="`word${i}`"
        :label="`${word}`"
        color="secondary"
        @click="addToSequence(word)"
      />
    </div>
    <div class="btns-wrapper">
      <q-btn
        :disabled="resetDisabled"
        color="secondary"
        label="Reset"
        @click="reset"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      pipSeq: [],
    };
  },
  computed: {
    shuffledSeed() {
      return this.$store.getters['setup/getShuffledSeed'];
    },
    ...mapState({
      seed: state => state.setup.seed,
      id: state => parseInt(state.route.params.id, 10),
    }),

    resetDisabled() {
      return this.pipSeq.length === 0;
    },
  },
  watch: {
    pipSeq() {
      if (this.pipSeq.length === 12) {
        this.validate();
      }
    },
  },
  mounted() {
    this.reset();
  },
  methods: {
    validate() {
      if (Object.keys(this.seed).join('') === this.pipSeq.join('')) {
        this.$router.push({ path: `/setup/${this.id + 1}` });
      } else {
        this.$toast.create(10, this.$t('seedSeqNotMatch'), 500);
        this.reset();
      }
    },
    addToSequence(pip) {
      this.pipSeq.push(pip);
    },
    reset() {
      this.pipSeq = [];
    },
  },
};

</script>

<style>
.randomSeedContainer {
  margin-top: 1em;
}

.randomSeedContainer button {
  width: 20%!important;
  margin: 2.5%;
}
</style>
