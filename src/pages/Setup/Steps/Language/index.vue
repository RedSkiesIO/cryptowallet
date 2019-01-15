<template>
  <div class="container">
    <h1 class="setup">{{ $t("welcome") }}</h1>
    <!-- <h4 class="setup">{{ $t("selectLang") }}</h4> -->

    <div class="btns-wrapper">
      <q-btn
        :label="$t('createAccount')"
        icon="add_box"
        color="primary"
        text-color="blueish"
        @click="selection('new')"
      />
    </div>
    <div class="btns-wrapper">
      <q-btn
        :label="$t('importAccount')"
        icon="get_app"
        color="primary"
        text-color="blueish"
        @click="selection('restored')"
      />
    </div>
    <div class="flags">
      <!-- <div class="row">
        <q-btn
          color="secondary"
          label="New Account"
          @click="selection('new')"
        />
      </div>
    </div>
    <div class="flags">
      <q-btn
        color="secondary"
        label="Import Account"
        @click="selection('restored')"
      />
    </div> -->
      <div class="flags">
        <q-select
          v-model="selectedLang"
          :options="languageArray"
          :display-text="languageArray[0].label"
          float-label="Select your language"
          dark
        />
      </div>
    <!-- <div
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
      </div> -->
    </div>
</div></template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      locale: this.$i18n.locale,
      $i18n: '',
      selectedLang: '',
    };
  },
  computed: {
    ...mapState({
      id: state => parseInt(state.route.params.id, 10),
    }),
    languages() {
      console.log('object :', Object.keys(this.$i18n.messages));
      return Object.keys(this.$i18n.messages);
    },
    languageArray() {
      return this.languages.map(x => ({
        label: this.$t(x),
        value: x,
      }));
    },
  },
  methods: {
    selection(type) {
      console.log('type, this.selectedLang :', type, this.selectedLang);
      if (this.selectedLang) {
        this.$i18n.locale = this.selectedLang;
      } else {
        this.$i18n.locale = this.languageArray[0].value;
      }
      console.log('this.$i18n.locale :', this.$i18n.locale);
      if (type === 'new') {
        this.$store.dispatch('setup/setAccountType', 'new');
        this.$router.push({ path: `/setup/${this.id + 2}` });
        return true;
      }
      this.$store.dispatch('setup/setAccountLocale', this.selectedLang);
      this.$store.dispatch('setup/setAccountType', 'restored');
      this.$router.push({ path: `/setup/${this.id + 1}` });
      return true;
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
