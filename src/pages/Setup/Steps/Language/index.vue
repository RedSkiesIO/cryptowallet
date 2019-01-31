<template>
  <div class="container">
    <!-- <div class="done-msg-wrapper">
      <h1>THE REVOLUTION <span class="hollow-text">WILL NOT BE CENTRALISED</span></h1>
    </div>
     -->

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
        <!-- <q-select
          v-model="selectedLang"
          :options="languageArray"
          :display-text="languageArray[0].label"
          float-label="Select your language"
          dark
        /> -->
        <div class="row q-input bg-blueish">
          <div class="col-2 flag-icon">
            <img
              :src="selectedLang.icon"
              class="select-icon">
          </div>
          <div class="col-10 input-field">
            <v-select
              v-model="selectedLang"
              :options="languageArray"
              :searchable="false"
              :clear-search-on-select="false"
              :filterable="false"
              class="lang-select"
              label="label">
              <template
                slot="option"
                slot-scope="option">
                <div class="row">
                  <div class="col-2">
                    <img
                      :src="option.icon"
                      class="input-icon">
                  </div>
                  <div class="label col-10">
                    {{ option.label }}
                  </div>
                </div>
              </template>
            </v-select>
          </div>
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
    </div>

    <div class="loading-footer">
      <!-- <div class="developed-by">Designed and Developed by</div> -->
      <img
        class="logo-loading"
        src="~/assets/logo-white-horizontal.png"
      >
    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {

  data() {
    return {
      locale: this.$i18n.locale,
      $i18n: '',
      selectedLang: {
        label: 'English',
        value: 'en-gb',
        icon: '/assets/flags/en-gb.svg',
      },
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
      // return this.languages.map(x => ({
      //   label: this.$t(x),
      //   value: x,
      //   icon: `/assets/flags/${x}.svg`,
      // }));
      return [
        {
          label: 'English',
          value: 'en-gb',
          icon: '/assets/flags/en-gb.svg',
        },
        {
          label: 'French',
          value: 'fr-fr',
          icon: '/assets/flags/fr-fr.svg',
        },
        {
          label: 'Spanish',
          value: 'es-es',
          icon: '/assets/flags/es-es.svg',
        },
        {
          label: 'Greek',
          value: 'el-gr',
          icon: '/assets/flags/el-gr.svg',
        },
      ];
    },
  },
  methods: {
    selection(type) {
      console.log('type, this.selectedLang :', type, this.selectedLang);
      if (this.selectedLang) {
        this.$i18n.locale = this.selectedLang.value;
      } else {
        this.$i18n.locale = this.languageArray[0].value;
      }
      console.log('this.$i18n.locale :', this.$i18n.locale);
      if (type === 'new') {
        this.$store.dispatch('setup/setAccountType', 'new');
        this.$router.push({ path: `/setup/${this.id + 2}` });
        return true;
      }
      this.$store.dispatch('setup/setAccountLocale', this.selectedLang.value);
      this.$store.dispatch('setup/setAccountType', 'restored');
      this.$router.push({ path: `/setup/${this.id + 1}` });
      return true;
    },

  },
};

</script>

<style>
.done-msg-wrapper {
  text-align: center;
  font-family: 'CooperHewitt-HeavyItalic';
  text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.5);
  margin-bottom: 2em;
}
.done-msg-wrapper h1 {
  font-size: xx-large;
  letter-spacing: 0.1em;
  line-height: initial;
}

.hollow-text{
  -webkit-text-stroke: 1px white;
  -webkit-text-fill-color: rgb(47, 59, 82);
}

.flags {
  display: flex;
  justify-content: space-around;
  max-width: 80%;
  margin: 1em auto 2em auto;
  opacity: 0;
  height: 0;
}

.flag-wrapper {
  text-align: center;
}

.flag_icon {
  height: 60px;
  width: 60px;
}

.lang-select{
  min-width: 40vw;
  padding-bottom: 3px;
}

.lang-select .selected-tag{
  color:white;
  padding-left: 10px;
}
.lang-select .dropdown-toggle{
    border:none;
  }
.lang-select .dropdown-toggle .clear{
    border:none;
    display:none;
  }

  .input-icon{
    width: 1.5em;
    margin-left: -5px;
  }
  .select-icon{
    width: 1.5em;
    margin-left: 15px;
    margin-top: 5px;
  }
 .lang-select .dropdown-menu {
   background-color: darkslategrey;
   color: white;
   width: 125%;
   margin-left: -21%;
 }
 .lang-select .label {
   color: white;
   padding-left: 0.3em;
   padding-top: 0.19em;
 }
 .lang-select .open-indicator:before {
   border-color: white;
 }
 .lang-select .form-control {
   display: none;
 }
 .flag-icon{
   padding-top: 2px;
 }

 .input-field{
   padding-top: 3px;
   padding-right: 5px;
 }

</style>
