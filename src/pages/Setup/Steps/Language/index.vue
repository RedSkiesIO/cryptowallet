<template>
  <div class="container">
    <div>
      <h1 id="welcome_id">{{ $t("welcome") }}</h1>
    </div>
    <div>
      <h4 id="Subtitle_id">{{ $t("selectLang") }}</h4>
    </div>
    <div class="columns is-mobile">
      <div
        v-for="(message, i) in $i18n.messages"
        :key="`message${i}`"
        class="column is-4 flag-wrapper"
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
export default {

  data() {
    return {
      locale: this.$i18n.locale,
    };
  },

  methods: {

    validate() {
      if (this.locale !== this.$i18n.locale) {
        this.$toast.create(10, this.$t('localSelectError'), 500);
      }
      return true;
    },

    /**
     * set the vue-i8ln locale
     */
    selectLang(language) {
      this.locale = language;
      this.$i18n.locale = language;
      this.$store.dispatch('setup/setAccountLocale', language);
      this.$root.$emit('showNext');
    },
  },
};

</script>

<style scoped>

.flag-wrapper {
  text-align: center;
}

h1#welcome_id {
  text-align: center;
  top: 25px;
  font-size: 30px;
  font-weight: bold;
}

h4#Subtitle_id {
  text-align: center;
  top: 80px;
  font-size: 20px;
  font-weight: bold;
}

.flag_icon {
  background-color: Transparent;
  height: 60px;
  width: 60px;
  background-repeat:no-repeat;
  border: none;
  cursor:pointer;
  overflow-x: auto;
  outline:none;
}
</style>
