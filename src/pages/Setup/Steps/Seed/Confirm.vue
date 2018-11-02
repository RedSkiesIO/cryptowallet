<template>
  <section>
    <div>
      <h1 id="title_id">{{ $t('setupTitle') }}</h1>
      <span id="subtitle_id">
        {{ $t('pressSeed') }}
      </span>
      <div class="randomSeedContainer">
        <q-btn
          v-for="(word, i) in shuffledSeed"
          :key="`word${i}`"
          :label="`${word}`"
          style="color: goldenrod;"
          outline
          @click="addToSequence(word)"
        />
      </div>
    </div>
  </section>
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
    }),
  },

  watch: {
    pipSeq() {
      if (this.pipSeq.length === 12) {
        this.$root.$emit('showNext');
      }
    },
  },

  methods: {
    validate() {
      return this.arraysEqual(Object.keys(this.seed), this.pipSeq);
    },

    /**
     * Checks two arrays are the same.
     */
    arraysEqual(a, b) {
      if (a instanceof Array && b instanceof Array) {
        if (a.length !== b.length) {
          this.$toast.create(10, this.$t('seedSeqNotMatch'), 500);
          this.pipSeq.length = 0;
          return false;
        }
        for (let i = 0; i < a.length; i += 1) {
          if (!this.arraysEqual(a[i], b[i])) {
            this.$toast.create(10, this.$t('seedSeqNotMatch'), 500);
            this.pipSeq.length = 0;
            return false;
          }
          this.pipSeq.length = 0;
          return true;
        }
      } else {
        return a === b;
      }
      this.pipSeq.length = 0;
      return true;
    },

    addToSequence(pip) {
      this.pipSeq.push(pip);
    },
  },
};

</script>

