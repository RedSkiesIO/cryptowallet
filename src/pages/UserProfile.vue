<template>
  <q-layout>
    <q-page-container>
      <button id="backButton_id">
        <img src= "~/assets/back.png">
      </button>
      <div class="mainContent">
        <ProfileCard id="profilecard_id"/>
        <hr>
        <div id="profileButtons_id" >
          <h1>Profile</h1><br><br><br>
          <a href="#"><i> <img src="~/assets/personal-details.png">&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;Personal Details</i></a>
          <br><br>
          <a href="#"><i> <img src="~/assets/acount_details.png">&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;Acount Details</i></a>
          <br><br>
          <a href="#"><i> <img src="~/assets/acount_details.png">&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;Top-up Limit</i></a>
        </div>
        <hr>
        <div id="profileButtons_id" >
          <strong>Security</strong> <br><br>
          <a href="#"><i> <img src="~/assets/personal-details.png">&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;Some text here</i></a>
          <br><br>
          <a href="#"><i> <img src="~/assets/acount_details.png">&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;Some text here</i></a>
          <br><br>
          <a href="#"><i> <img src="~/assets/acount_details.png">&nbsp;&nbsp;
          &nbsp;&nbsp;&nbsp;&nbsp;Some text here</i></a>
        </div>
        <br>
        <a>
          <router-link
            id="editBtn_id"
            tag="button"
            class="button is-dark"
            to="/EditProfile">Edit Profile Details
          </router-link>
        </a>
        <br><br>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import ProfileCard from '../components/ProfileCard.vue';

export default {

  components: {
    ProfileCard,
  },

  data() {
    return {

    };
  },

  beforeCreate() {

  },

  created() {

  },

  beforeMount() {

  },

  mounted() {

  },

  beforeUpdate() {

  },

  updated() {

  },

  beforeDestroy() {

  },

  destroyed() {

  },

  methods: {

  },

};


</script>

<style scoped>

.mainContent {
  max-width: 300px;
  margin: auto;
  background: white;
  padding: 10px;
  text-align: center;
}

.title {
  color: grey;
  font-size: 18px;
}

button {
  border: none;
  outline: 0;
  display: inline-block;
  padding: 8px;
  color: white;
  background-color: rgb(142, 187, 224);
  text-align: center;
  cursor: pointer;
  width: 100%;
  font-size: 15px;
}

a {
  text-decoration: none;
  font-size: 22px;
  color: rgb(70, 119, 165);
}

h1 {
  text-decoration: none;
  font-size: 18px;
  color: rgb(51, 130, 204);
  font-weight: bold;
}

h2 {
font-weight: bold;
font-size: 130%;
}

img {
  height: 80px;
  width: 30%;
}

#editBtn_id {
  background-color: #8099b3;
}

#backButton_id {
  background-color: transparent;
  text-align: left;
  top: 0px;
  left:0px;
  height: 50px;
  width: 200px;
  vertical-align: middle;
}

#profileButtons_id {
  margin: 44px 0;
  text-align: left;
}

#profileButtons_id img {
  height: 30px;
  width: 10%;
}

button:hover, a:hover {
  opacity: 0.7;
}

</style>
