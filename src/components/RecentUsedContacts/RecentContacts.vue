<template>
  <div class="mainContentContacts">
    <p> &nbsp; </p>
    <p id="Title_id">
      &nbsp;{{ $t("recent") }}
    </p>
    <hr>
    <div class="container is-fluid">
      <div id="items">
&nbsp;
        <div class="item">
          <RecentContactBox />
        </div>&nbsp;
        <div class="item">
          <RecentContactBox />
        </div>&nbsp;
        <div class="item">
          <RecentContactBox />
        </div>&nbsp;
        <div class="item">
          <RecentContactBox />
        </div>&nbsp;
        <div class="item">
          <RecentContactBox />
        </div>&nbsp;
        <div class="item">
          <RecentContactBox />
        </div>&nbsp;
        <div class="item">
          <RecentContactBox />
        </div>&nbsp;
        <div class="item">
          <RecentContactBox />
        </div>&nbsp;
        <div class="item">
          <RecentContactBox />
        </div>&nbsp;&nbsp;
        <br>
      </div>
    </div>
    <br>
  </div>
</template>

<script>
import RecentContactBox from './RecentContactBox.vue';

export default {

  components: {
    RecentContactBox,
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

.mainContentContacts {
  background-color:transparent;
  width: auto;
  height: auto;
  margin: auto;
}

#Title_id {
  color: white;
  font-size: 18px;
  font-weight: bold;
  margin-left: 10px;
  }

  #items{
  overflow-x: scroll;
  width: auto;
  white-space: nowrap;
  }
  .item{
    text-align: center;
    position: sticky;
    display: inline-block;
  }

  img {
  height: 70px;
  width: 45%;
}

</style>
