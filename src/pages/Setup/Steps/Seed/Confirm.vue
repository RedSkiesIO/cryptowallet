<template>
  <div>
    <h1 class="setup">{{ $t('confirmSeed') }}</h1>
    <p class="setup">
      {{ $t('pressSeed') }}
    </p>
    <div class="randomSeedContainer">
      <q-input
        v-for="(word, i) in shuffledSeed"
        :key="`holder${i}`"
        v-model.trim="seedPhrase[i]"
        :prefix="(i+1)+'. '"
        class="seed-input"
        color="secondary"
        readonly
      />
    </div>
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
import { setTimeout } from 'timers';

export default {
  data() {
    return {
      pipSeq: [],
      seedPhrase: [],
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
        setTimeout(() => {
          this.validate();
        }, 500);
      }
    },
  },
  mounted() {
    this.reset();
  },
  methods: {
    validate() {
      if (Object.keys(this.seed).join('') === this.pipSeq.join('')) {
        this.$router.push({ path: `/setup/${this.id + 2}` });
      } else {
        this.$toast.create(10, this.$t('seedSeqNotMatch'), 500);
        this.reset();
      }
    },
    addToSequence(pip) {
      this.pipSeq.push(pip);
      this.seedPhrase.push(pip);
    },
    reset() {
      this.pipSeq = [];
      this.seedPhrase = [];
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
.randomSeedContainer .q-input {
  width: 20%!important;
  margin-left: 2.5%;
  margin-right: 2.5%;
  margin-bottom: 2.5%;
  display: inline-flex;
}
.seed-input{
    margin-right: 1em;
    margin-bottom: 1em;
    font-size: 'small';
}

.seed-input .q-if-addon{
    font-size: small;
    color: #c7c7c7;
}

.seed-input .q-input-target{
    font-size: small;
    color: white;
    padding-left: 2px;
}

.randomSeedContainer .text-secondary {
    color: rgba(0, 0, 0, 0)!important;
}

.randomSeedContainer
.q-if:not(.q-if-disabled):not(.q-if-error):not(.q-if-warning):hover:before,
.q-if.q-if-readonly:not(.q-if-error):not(.q-if-warning):after {
    color: #bdbdbd!important;
    border-bottom: 1px solid;
}

.randomSeedContainer .q-if-focused{
  border: none;
}
</style>
