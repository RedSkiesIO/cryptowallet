<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState({
      salt: (state) => { return state.setup.salt; },
      minLength: (state) => { return state.settings.pin.minLength; },
      pinHash: (state) => { return state.setup.pinHash; },
      pinHashConfirm: (state) => { return state.setup.pinHashConfirm; },
    }),
  },
  created() {
    this.pinInputListener();
  },
  methods: {
    /**
     * adds or removes pin input event to pin arr.
     */
    pinInputListener() {
      this.$root.$on('inputPin', (pinArr) => {
        this.pin = pinArr;
        if (this.pin.length >= this.minLength) {
          this.$root.$emit('showNext');
        }
      });
    },
  },
};
</script>
