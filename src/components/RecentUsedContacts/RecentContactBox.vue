<template>
  <div class="contactBox">
    <router-link
      id="Btn_id"
      tag="button"
      to="/#FixThePath">
      <div class="item">
        <img src="~/assets/avatar.png">
        <p id="usersName_id">Name Surname</p>
      </div>&nbsp;
    </router-link>
    <!-- <br><br> -->
  </div>
</template>

<script>

export default {

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

  .item{
    text-align: center;
    position: sticky;
    display: inline-block;
    width: 150px;
    height: 140px;
    border-radius: 50px;
    /* border: 3px solid rgb(41, 128, 187); */
  }

  img {
  height: 70px;
  width: 45%;
}

p#usersName_id {
  color: white;
}

#Btn_id {
  background-color: Transparent;
  border: none;
  cursor:pointer;
  overflow: hidden;
  outline:none;
}

</style>
