<template>
  <div>
    <div id="pins_id"/>
    <p id="showPass_id">
      {{ pinValue1 }}
    </p>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import keyboard from 'vue-keyboard';

export default {

  components: {
    keyboard,
  },

  data() {
    return {
      pin: [],
    };
  },

  computed: {
    ...mapState({
      minLength: state => state.settings.pin.minLength,
      pinValue1: state => state.setup.pinValue1,
      pinValue2: state => state.setup.pinValue2,
    }),

    // display pin with asterisks.
    pinHERE() {
      if (this.pin.length > 0) {
        return Array(this.pin.length + 1).join('*');
      }
      return 'Choose your pin';
    },
  },

  methods: {

    /**
     * Emits pin code to parent components.
     * @param pin
     */
    inputPin(pin) {
      if (pin === '') {
        this.pin.pop();
        // delete the last state
        this.$store.dispatch('setup/deletePin1');
        // delete the last asterisk
        const pins = document.getElementById('pins_id').innerHTML;
        const newVal = pins.substring(0, pins.length - 1);
        document.getElementById('pins_id').innerHTML = newVal;
      } else if (this.pin) {
        // set pin
        this.$store.dispatch('setup/setPin1', pin);
        document.getElementById('pins_id').innerHTML += '*';
      }
      if (this.pin.length >= this.minLength) {
        this.$root.$emit('inputPin', this.pin);
      }
    },

    /**
     * Show hidden password after clicking checkBox
     */
    showPinPass1() {
      const checkBox = document.getElementById('checkbox_id');
      const pass1 = document.getElementById('showPass_id');
      if (checkBox.checked === true) {
        pass1.style.display = 'block';
      } else {
        pass1.style.display = 'none';
      }
    },
  },
};

</script>

<style lang="scss" scoped>

#content{
    margin-left: auto;
    margin-right: auto;
    width: 18em;
}

div#pins_id {
  text-align: center;
  font-weight: bold;
  font-size: 30px;
  border: 2px solid rgb(80, 132, 153);
  border-radius: 12px;
  display: block;
}

#showPass_id {
  display:none;
  text-align: center;
  /* margin-left:  110px; */
  font-size: 18px;
}

input[type="checkbox"]#checkbox_id{
cursor: pointer;
-webkit-appearance: none;
appearance: none;
background: #34495E;
border-radius: 1px;
box-sizing: border-box;
position: relative;
box-sizing: content-box ;
width: 25px;
height: 45px;
margin-right: -40px;
float: right;
border-radius: 12px;
border-width: 0;
transition: all .3s linear;
}
input[type="checkbox"]:checked#checkbox_id{
  background-color: rgb(204, 46, 46);
}
input[type="checkbox"]:focus#checkbox_id{
  outline: 0 none;
  box-shadow: none;
}
</style>
