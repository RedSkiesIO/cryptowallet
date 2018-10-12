<template>
  <q-layout>
    <q-page-container>
      <button id="backButton_id">
        <img src= "~/assets/back.png">
      </button>
      <ProfileCard/>
      <div class="mainContent">
        <hr>
        <div id="form_id" >
          <h1>Profile</h1><br><br>

          <div class="field">
            <label class="label">Name</label>
            <input
              id="input_id"
              type="text"
              placeholder="Name"
              title="Lastname"
              pattern="[a-zA-Z0-9]+"
              required
              minlength="2"
              maxlength="128">
          </div>
          <div class="field">
            <label class="label">Surname</label>
            <input
              id="input_id"
              type="text"
              placeholder="Surname"
              title="Lastname"
              pattern="[a-zA-Z0-9]+"
              required
              minlength="2"
              maxlength="128">
          </div>
          <br>

        </div>
        <div class="field">
          <label class="label">Email</label>
          <input
            id="input_id"
            type="email"
            placeholder="me@example.com"
            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$"
            required
            title="email address">
        </div>

        <div class="field">
          <label class="label">Password</label>
          <input
            id="input_id"
            type="password"
            placeholder="Password"
            title="password"
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
            required
            minlength="6"
            maxlength="128">
        </div>
        <div class="field">
          <input
            id="input_id"
            type="password"
            placeholder="Repeat Password"
            title="password"
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}"
            required
            minlength="6"
            maxlength="128">
        </div>
        <br>
        <div class="field">
          <label class="label">Example Subject</label>
          <div class="control">
            <div class="select">
              <select>
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
                <option>Option 4</option>
                <option>Option 5</option>
              </select>
            </div>
          </div>
        </div>
        <br><br>
        <div class="field">
          <div class="control">
            <label class="checkbox">
              <input type="checkbox">
              I agree to the <a href="#">terms and conditions</a>
            </label>
          </div>
        </div>

        <div class="field">
          <div class="control">
            <label class="radio">
              <input
                type="radio"
                name="question">Yes
            </label>
            <label class="radio">
              <input
                type="radio"
                name="question">No
            </label>
          </div>
        </div>

        <br><br>
        <div class="field is-grouped">
          <div class="control">
            <router-link
              id="saveBtn_id"
              tag="button"
              class="button is-link"
              to="/UserProfile">Save
            </router-link>
          </div>
          <div class="control">
            <router-link
              id="cancelBtn_id"
              tag="button"
              class="button is-text"
              to="/UserProfile">Cancel
            </router-link>
          </div>
        </div>
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
  text-align: left;
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
  font-size: 18px;
  color: rgb(51, 130, 204);
}

h1 {
  text-decoration: none;
  font-size: 18px;
  color: rgb(51, 130, 204);
  font-weight: bold;
}

img {
  height: 80px;
  width: 30%;
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


button:hover, a:hover {
  opacity: 0.7;
}

#input_id {
    width: 100%;
    padding: 6px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;

}
</style>
