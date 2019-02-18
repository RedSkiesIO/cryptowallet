<template>
  <div class="container">
    <div class="table-title">
      <h3>Transaction Information</h3>
    </div>
    <div class="wrapper ">
      <table class="table-fill">
        <tbody class="table-hover">
          <tr>
            <td class="text-left">TxHash:
              <p id="txHash_id">
                0x97f5e7e95e37ed19714a9da8f86149d3af2905700ff5704aaa22ba70c469945a</p>
            </td>
          </tr>
          <tr>
            <td class="text-left">TxReceipt Status:
              <p id="txReceiptStatus_id">Success </p>
            </td>
          </tr>
          <tr>
            <td class="text-left">TimeStamp:
            <p id="timeStamp_id">45 secs ago (Oct-09-2018 10:07:15 AM +UTC) </p></td>
          </tr>
          <tr>
            <td class="text-left">From:
            <p id="from_id">0xa11b2364b3e1f7d94f51444fb560bb206af85efe </p></td>
          </tr>
          <tr>
            <td class="text-left">To:
            <p id="to_id">0xa11b2364b3e1f7d94f51444fb560bb206af85efe </p></td>
          </tr>
          <tr>
            <td class="text-left">Value:
            <p id="value_id">4.237564853702590359 Atlas ($968.45) </p></td>
          </tr>
          <tr>
            <td
              id="txCostFee_id"
              class="text-left">Actual Tx Cost/Fee:
            <p>0.000084 Atlas ($0.02) </p></td>
          </tr>
        </tbody>
      </table>
    </div>
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

.content {
  margin-top: 5px;
}

div.table-title {
  display: block;
  margin: auto;
  max-width: 600px;
  padding:5px;
  width: 100%;
}

.table-title h3 {
   color: #fafafa;
   font-size: 30px;
   font-weight: 400;
   font-style:normal;
   font-family: "Roboto", helvetica, arial, sans-serif;
   text-shadow: -1px -1px 1px rgba(0, 0, 0, 0.1);
   text-transform:uppercase;
}


div.wrapper {
  height: auto;
  overflow: auto;
}

/*** Table Styles **/
.table-fill {
  background: white;
  border-radius:3px;
  border-collapse: collapse;
  height: 320px;
  margin: auto;
  max-width: 600px;
  padding:5px;
  width: 100%;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  animation: float 5s infinite;
}

th {
  color:#D5DDE5;;
  background:#5dbeff;
  border-bottom:4px solid #9ea7af;
  border-right: 1px solid #343a45;
  font-size:23px;
  font-weight: 100;
  padding:24px;
  text-align:left;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  vertical-align:middle;
}

th:first-child {
  border-top-left-radius:3px;
}

th:last-child {
  border-top-right-radius:3px;
  border-right:none;
}

tr {
  border-top: 1px solid #C1C3D1;
  border-bottom: 1px solid #C1C3D1;
  color:#666B85;
  font-size:16px;
  font-weight:normal;
  text-shadow: 0 1px 1px rgba(256, 256, 256, 0.1);
    overflow: auto;
  white-space: nowrap;
}

tr:hover td {
  background:#4E5066;
  color:#FFFFFF;
  border-top: 1px solid #22262e;
}

tr:first-child {
  border-top:none;
}

tr:last-child {
  border-bottom:none;
}

tr:nth-child(odd) td {
  background:#EBEBEB;
}

tr:nth-child(odd):hover td {
  background:#4E5066;
}

tr:last-child td:first-child {
  border-bottom-left-radius:3px;
}

tr:last-child td:last-child {
  border-bottom-right-radius:3px;
}

h1 {
  font-size: 25px;
}

td {
  background:#FFFFFF;
  padding:20px;
  text-align:left;
  vertical-align:middle;
  font-weight:bold;
  font-size:18px;
  text-shadow: -1px -1px 1px rgba(0, 0, 0, 0.1);
  border-right: 1px solid #C1C3D1;
}

p {
    font-weight:300;
}

td:last-child {
  border-right: 0px;
}

th.text-left {
  text-align: left;
}

th.text-center {
  text-align: center;
}

th.text-right {
  text-align: right;
}

td.text-left {
  text-align: left;
}

td.text-center {
  text-align: center;
}

td.text-right {
  text-align: right;
}

#txReceiptStatus_id {
  color: rgb(122, 204, 0);
  font-weight: 500;
}

</style>
