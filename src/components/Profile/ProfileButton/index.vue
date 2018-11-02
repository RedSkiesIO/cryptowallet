<template>
  <q-page>
    <div class="profileButton">
      <div class="container">
        <router-link
          id="btn_id"
          tag="button"
          to="/UserProfile">
          <p id="profile_id">{{ $t('profile') }}</p>
        </router-link>
      </div>
    </div>
  </q-page>
</template>

<script>

export default {

  // data() {
  //   return {

  //   };
  // },

  // beforeCreate() {

  // },

  // created() {

  // },

  // beforeMount() {

  // },

  // mounted() {

  // },

  // beforeUpdate() {

  // },

  // updated() {

  // },

  // beforeDestroy() {

  // },

  // destroyed() {

  // },

  // methods: {

  // },

};

</script>

<style scoped>
#profile_id{
  position:relative;
  left: 0%;
  top: 35%;
  font-weight:bold;
}

.container {
    position: relative;
}

#btn_id {
    background-image: url( "~assets/avatar.png" );
    background-color: Transparent;
    background-size: 90px 95px;
    height: 110px;
    width: 95px;
    background-repeat:no-repeat;
    border: none;
    cursor:pointer;
    overflow: hidden;
    outline:none;
    }
</style>
