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
        v-if="mode === 'pin-setup' || mode === 'new-pin'"
        :disabled="canProceed"
        color="secondary"
        label="Done"
        @click="done"
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
      minLength: state => state.settings.pin.minLength,
      pin: state => state.setup.pinArray,
      pinConfirm: state => state.setup.pinConfirmArray,
      salt: state => state.setup.salt,
      id: state => parseInt(state.route.params.id, 10),
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
      this.input.push(Math.random());

      setTimeout(() => {
        if (this.mode === 'pin-setup') {
          this.$store.dispatch('setup/setPin', { value: pin });
          this.$store.dispatch('setup/setPinHash', this.$CWCrypto.bcryptHashString(this.pin.join(''), this.salt));
        }

        if (this.mode === 'pin-confirm') {
          this.$store.dispatch('setup/setPinConfirm', { value: pin });
          this.$store.dispatch('setup/setPinHashConfirm', this.$CWCrypto.bcryptHashString(this.pinConfirm.join(''), this.salt));
          this.$parent.validatePin();
        }

        if (this.mode === 'auth') {
          this.$root.$emit('inputPin', pin);
          this.$parent.attemptUnlock();
        }

        if (this.mode === 'access') {
          this.$emit('inputPin', pin);
          this.$emit('attemptUnlock');
        }

        if (this.mode === 'new-pin') {
          this.$emit('inputPin', pin);
        }

        if (this.mode === 'confirm-new-pin') {
          console.log('wtf');
          this.$emit('inputPin', pin);
          this.$emit('attemptConfirm');
        }
      }, 25);
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
  background: transparent;
  border-radius: 100%;
  border: 1px solid white;
  color: white;
  font-weight: bold;
  font-size: 1.5rem;
  width: 2.5em;
  height: 2.5em;
  margin: 0.25em 0.5em;
  line-height: 1.8;
}

.dots-wrapper {
  height: 1em;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: .75em;
}

.dot {
  background: rgba(0,0,0,0.2);
  width: .75em;
  height: .75em;
  border-radius: 100%;
  display: block;
  margin: 0 .5em;
}
</style>
