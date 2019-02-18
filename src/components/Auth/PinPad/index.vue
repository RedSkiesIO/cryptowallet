<template>
  <div>
    <keyboard
      :layouts="['123|456|789|0']"
      @input="inputPin"
    />
    <div class="dots-wrapper">
      <span
        v-for="item in input"
        :key="item"
        class="dot"
      />
    </div>

    <div class="btns-wrapper">
      <q-btn
        :disabled="resetDisabled"
        color="secondary"
        label="Clear"
        @click="clearPinArray"
      />

      <q-btn
        v-if="mode === 'pin-setup' || mode === 'new-pin' || mode === 'confirm-new-pin'"
        :disabled="canProceed"
        color="yellow"
        text-color="blueish"
        label="Done"
        @click="done"
      />

      <q-btn
        v-if="mode != 'pin-setup' && mode != 'new-pin' && mode != 'confirm-new-pin'"
        :disabled="canProceed"
        color="yellow"
        text-color="blueish"
        label="Unlock"
        @click="confirmPin"
      />

    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import keyboard from 'vue-keyboard';

export default {
  components: {
    keyboard,
  },
  props: {
    mode: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      input: [],
    };
  },
  computed: {
    ...mapState({
      minLength: (state) => { return state.settings.pin.minLength; },
      pin: (state) => { return state.setup.pinArray; },
      pinConfirm: (state) => { return state.setup.pinConfirmArray; },
      salt: (state) => { return state.setup.salt; },
      id: (state) => { return parseInt(state.route.params.id, 10); },
    }),
    canProceed() {
      return this.input.length < this.minLength;
    },
    resetDisabled() {
      return this.input.length === 0;
    },
  },
  mounted() {
    this.clearPinArray();
  },
  methods: {
    /**
     * Emits pincode to parent components.
      * @param {*} pin
     */
    inputPin(pin) {
      /* const btn = document.querySelectorAll(`[data-text='${pin}']`)[0];
      btn.className += ' active';
      setTimeout(() => {
        btn.classList.remove('active');
      }, 200); */
      if (navigator && navigator.vibrate) {
        navigator.vibrate(25);
      }

      this.input.push(Math.random());

      setTimeout(() => {
        if (this.mode === 'pin-setup') {
          this.$store.dispatch('setup/setPin', { value: pin });
        }

        if (this.mode === 'pin-confirm') {
          this.$store.dispatch('setup/setPinConfirm', { value: pin });
        }

        if (this.mode === 'auth') {
          this.$root.$emit('inputPin', pin);
        }

        if (this.mode === 'access') {
          this.$emit('inputPin', pin);
        }

        if (this.mode === 'new-pin') {
          this.$emit('inputPin', pin);
        }

        if (this.mode === 'confirm-new-pin') {
          this.$emit('inputPin', pin);
        }
      }, 50);
    },
    confirmPin() {
      setTimeout(() => {
        if (this.mode === 'pin-confirm') {
          this.$parent.validatePin();
        }

        if (this.mode === 'auth') {
          this.$parent.attemptUnlock();
        }

        if (this.mode === 'access') {
          this.$emit('attemptUnlock');
        }
      }, 50);
    },
    clearPinArray() {
      this.input = [];
      if (this.mode === 'pin-setup') this.$store.dispatch('setup/resetPin');
      if (this.mode === 'pin-confirm') this.$store.dispatch('setup/resetPinConfirm');
      if (this.mode === 'auth') this.$parent.resetPin();
      if (this.mode === 'access') this.$emit('resetPin');
      if (this.mode === 'new-pin') this.$emit('resetPin');
      if (this.mode === 'confirm-new-pin') this.$emit('resetPin');
    },
    done() {
      if (this.mode === 'pin-setup') this.$router.push({ path: `/setup/${this.id + 1}` });
      if (this.mode === 'new-pin') this.$emit('newPinSet');
      if (this.mode === 'confirm-new-pin') this.$emit('attemptConfirm');
    },

    /**
     * Resets PinPad internal state
     */
    resetState() {
      this.input = [];
    },
  },
};

</script>

<style>
.vue-keyboard-key,
.vue-keyboard-key:hover {
  background: rgba(0,0,0,0);
  border-radius: 100%;
  border: 1px solid white;
  color: white;
  font-weight: bold;
  font-size: 1.5rem;
  width: 2.5em;
  height: 2.5em;
  margin: 0.25em 0.5em;
  line-height: 1.8;
  transition: all ease-in-out 100ms;
}

.vue-keyboard-key.active {
  background: rgba(255,255,255,0.1);
}

.dots-wrapper {
  height: 1em;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: .5rem;
}

.dot {
  background: rgba(0,0,0,0.3);
  width: .75em;
  height: .75em;
  border-radius: 100%;
  display: block;
  margin: 0 .5em;
}
</style>
