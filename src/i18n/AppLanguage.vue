<template>
  <div class="container">
    <h1 id="welcomeId">{{ $t("welcome") }}</h1>
    <h4 id="subtitleId">{{ $t("selectLang") }}</h4>
    <table>
      <tr>
        <td>
          <button
            id="armeniaBtnId"
            type="button"
            data-lang="hy-am"
            @click="selectLang('hy-am')"/>
        </td>
        <td>
          <button
            id="cyprusBtnId"
            type="button"
            data-lang="cy-gr"
            @click="selectLang('cy-gr')"/>
        </td>
        <td>
          <button
            id="englandBtnId"
            type="button"
            data-lang="en-us"
            @click="selectLang('en-us')"/>
        </td>
      </tr>
      <tr>
        <td>
          <button
            id="polandBtnId"
            type="button"
            data-lang="pl-pl"
            @click="selectLang('pl-pl')"/>
        </td>
        <td>
          <button
            id="italyBtnId"
            type="button"
            data-lang="it-it"
            @click="selectLang('it-it')"/>
        </td>
        <td>
          <button
            id="spainBtnId"
            type="button"
            data-lang="es-es"
            @click="selectLang('es-es')"/>
        </td>
      </tr>
      <tr>
        <td>
          <button
            id="israelBtnId"
            type="button"
            data-lang="he-il"
            @click="selectLang('he-il')"/>
        </td>
        <td>
          <button
            id="greeceBtnId"
            type="button"
            data-lang="el-gr"
            @click="selectLang('el-gr')"/>
        </td>
        <td>
          <button
            id="franceBtnId"
            type="button"
            data-lang="fr-fr"
            @click="selectLang('fr-fr');"/>
        </td>
      </tr>
      <tr>
        <td>
          <button
            id="canadaBtnId"
            type="button"
            data-lang="en-ca"
            @click="selectLang('en-ca')"/>
        </td>
        <td>
          <button
            id="chinaBtnId"
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
import ProfileCard from '../../components/Profile/ProfileCard.vue';

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
    lang(lang) {
      import(`quasar-framework/i18n/${lang}`).then(this.$q.i18n.set(lang.default));
    },
  },

  methods: {
    selectLang: (language) => {
      console.log(language);
    },
  },
};

</script>

<style scoped>

.container {
  height: 100%;
}

h1#welcomeId {
  text-align: center;
  position: relative;
  top: 120px;
  font-size: 35px;
  font-weight: bold;
}

h4#subtitleId {
  text-align: center;
  position: relative;
  top: 150px;
  font-size: 25px;
  font-weight: bold;
}

table {
  margin: 220px auto;
}


#armeniaBtnId {
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

#cyprusBtnId {
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

#englandBtnId {
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

#polandBtnId {
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

#italyBtnId {
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
#spainBtnId {
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

#israelBtnId {
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

#greeceBtnId {
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
#franceBtnId {
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
#canadaBtnId {
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
#chinaBtnId {
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
