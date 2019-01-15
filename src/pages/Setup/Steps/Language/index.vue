<template>
  <div class="container">
    <h1 class="setup">{{ $t("welcome") }}</h1>
    <h4 class="setup">{{ $t("selectLang") }}</h4>
    <div class="flags">
      <div
        v-for="(message, i) in $i18n.messages"
        :key="`message${i}`"
        class="flag-wrapper"
      >
        <img
          :src="`/assets/flags/${i}.png`"
          class="flag_icon"
          data-lang="`message${i}`"
          @click="selectLang(`${i}`)"
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      locale: this.$i18n.locale,
    };
  },
  computed: {
    ...mapState({
      id: state => parseInt(state.route.params.id, 10),
    }),
  },
  methods: {
    /**
     * set the vue-i8ln locale
     */
    selectLang(language) {
      this.$i18n.locale = language;
      this.$store.dispatch('setup/setAccountLocale', language);
      this.$router.push({ path: `/setup/${this.id + 1}` });
    },
  },
};

</script>

<style scoped>
.flags {
  display: flex;
  justify-content: space-around;
  max-width: 80%;
  margin: 1em auto 2em auto;
}

.flag-wrapper {
  text-align: center;
}

.flag_icon {
  height: 60px;
  width: 60px;
}
</style>
