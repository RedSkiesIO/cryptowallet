<template>
  <div class="container">
    <h1 id="welcome_id">{{ $t("welcome") }}</h1>
    <h4 id="Subtitle_id">{{ $t("selectLang") }}</h4>
    <table>
      <tr>
        <td>
          <button
            id="ArmeniaBtn_id"
            type="button"
            data-lang="hy-am"
            @click="selectLang('hy-am')"/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </td>
        <td>
          <button
            id="CyprusBtn_id"
            type="button"
            data-lang="cy-gr"
            @click="selectLang('cy-gr')"/>
        </td>
        <td>
          <button
            id="EnglandBtn_id"
            type="button"
            data-lang="en-us"
            @click="selectLang('en-us')"/>
        </td>
      </tr>
      <tr>
        <td>
          <button
            id="PolandBtn_id"
            type="button"
            data-lang="pl-pl"
            @click="selectLang('pl-pl')"/>
        </td>
        <td>
          <button
            id="ItalyBtn_id"
            type="button"
            data-lang="it-it"
            @click="selectLang('it-it')"/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </td>
        <td>
          <button
            id="SpainBtn_id"
            type="button"
            data-lang="es-es"
            @click="selectLang('es-es')"/>
        </td>
      </tr>
      <tr>
        <td>
          <button
            id="IsraelBtn_id"
            type="button"
            data-lang="he-il"
            @click="selectLang('he-il')"/>
        </td>
        <td>
          <button
            id="GreeceBtn_id"
            type="button"
            data-lang="el-gr"
            @click="selectLang('el-gr')"/>
        </td>
        <td>
          <button
            id="FranceBtn_id"
            type="button"
            data-lang="fr-fr"
            @click="selectLang('fr-fr');"/>
        </td>
      </tr>
      <tr>
        <td>
          <button
            id="CanadaBtn_id"
            type="button"
            data-lang="en-ca"
            @click="selectLang('en-ca')"/>
        </td>
        <td>
          <button
            id="ChinaBtn_id"
            type="button"
            data-lang="zh-cn"
            @click="selectLang('zh-cn')"/>
        </td>
      </tr>
      <p> {{ lang }} </p>
      <p> {{ lang }} </p>
    </table>
  </div>
</template>

<script>
import ProfileCard from '../../../components/Profile/ProfileCard.vue';
// import index from '../i18n/index.js';
// import VueI18n from 'vue-i18n';

export default {

  components: {
    ProfileCard,
  },

  data() {
    return {
      lang: this.$q.i18n.lang,
    };
  },

  watch: {
    // lang(lang) {
    //   import(`quasar-framework/i18n/${lang}`).then(this.$q.i18n.set(lang.default));
    // },
  },

  methods: {
    /**
     * @TODO document kyp
     * @param language
     */
    selectLang(language) {
      console.log(this.$q.i18n);
      this.$q.i18n.lang = language;
      console.log(this.$q.i18n);
    },
  },
};

</script>

<style scoped>

.container {
  height: 100%;
}

h1#welcome_id {
  text-align: center;
  position: relative;
  top: 120px;
  font-size: 35px;
  font-weight: bold;
}

h4#Subtitle_id {
  text-align: center;
  position: relative;
  top: 150px;
  font-size: 25px;
  font-weight: bold;
}

table {
  margin: 220px auto;
}


#ArmeniaBtn_id {
    background-image: url( "~assets/flags/Armenia-icon.png" );
    background-color: Transparent;
    height: 60px;
    width: 60px;
    background-repeat:no-repeat;
    border: none;
    cursor:pointer;
    overflow-x: auto;
    outline:none;
}

#CyprusBtn_id {
    background-image: url( "~assets/flags/Cyprus-icon.png" );
    background-color: Transparent;
    height: 80px;
    width: 65px;
    background-repeat:no-repeat;
    border: none;
    cursor:pointer;
    overflow-x: auto;
    outline:none;
}

#EnglandBtn_id {
    background-image: url( "~assets/flags/England-icon.png" );
    background-color: Transparent;
    height: 90px;
    width: 75px;
    background-repeat:no-repeat;
    border: none;
    cursor:pointer;
    overflow-x: auto;
    outline:none;
}

#PolandBtn_id {
    background-image: url( "~assets/flags/Poland-icon.png" );
    background-color: Transparent;
    height: 80px;
    width: 65px;
    background-repeat:no-repeat;
    border: none;
    cursor:pointer;
    overflow-x: auto;
    outline:none;
}

#ItalyBtn_id {
    background-image: url( "~assets/flags/Italy-icon.png" );
    background-color: Transparent;
    height: 90px;
    width: 75px;
    background-repeat:no-repeat;
    border: none;
    cursor:pointer;
    overflow-x: auto;
    outline:none;
}
#SpainBtn_id {
    background-image: url( "~assets/flags/Spain-icon.png" );
    background-color: Transparent;
    height: 80px;
    width: 65px;
    background-repeat:no-repeat;
    border: none;
    cursor:pointer;
    overflow-x: auto;
    outline:none;
}

#IsraelBtn_id {
    background-image: url( "~assets/flags/Israel-icon.png" );
    background-color: Transparent;
    height: 80px;
    width: 65px;
    background-repeat:no-repeat;
    border: none;
    cursor:pointer;
    overflow-x: auto;
    outline:none;
}

#GreeceBtn_id {
    background-image: url( "~assets/flags/Greece-icon.png" );
    background-color: Transparent;
    height: 90px;
    width: 75px;
    background-repeat:no-repeat;
    border: none;
    cursor:pointer;
    overflow-x: auto;
    outline:none;
}
#FranceBtn_id {
    background-image: url( "~assets/flags/France-icon.png" );
    background-color: Transparent;
    height: 80px;
    width: 65px;
    background-repeat:no-repeat;
    border: none;
    cursor:pointer;
    overflow-x: auto;
    outline:none;
}
#CanadaBtn_id {
    background-image: url( "~assets/flags/Canada.png" );
    background-color: Transparent;
    height: 40px;
    width: 80px;
    background-repeat:no-repeat;
    border: none;
    cursor:pointer;
    overflow-x: auto;
    outline:none;
}
#ChinaBtn_id {
    background-image: url( "~assets/flags/China.png" );
    background-color: Transparent;
    height: 35px;
    width: 80px;
    background-repeat:no-repeat;
    border: none;
    cursor:pointer;
    overflow-x: auto;
    outline:none;
}
</style>
