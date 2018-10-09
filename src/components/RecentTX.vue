<template>
  <div class="container">
    <router-link
      id="Btn_id"
      tag="button"
      to="/TxDetails">
      <p id="transaction_id">TX# &nbsp;
      0x97f5e7e95e37ed19714a9da8f86149d3af29057...
      </p>
    </router-link>
    <br>
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

<style @scoped>

.container {
  width: auto;
}

#Btn_id {
  background-color: white;
  width: auto;
  max-width: 600px;
  height: 45px;
  border: none;
  cursor:pointer;
  outline:none;
  margin-top: 5px;
  font-size: 20px;
}

</style>
