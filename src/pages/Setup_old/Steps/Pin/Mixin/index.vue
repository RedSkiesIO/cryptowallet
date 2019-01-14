<script>
import { mapState } from 'vuex';

export default {

  data() {
    return {
      pin: [],
    };
  },

  computed: {
    ...mapState({
      salt: state => state.setup.salt,
      minLength: state => state.settings.pin.minLength,
      pinHash: state => state.setup.pinHash,
      pinHashConfirm: state => state.setup.pinHashConfirm,
    }),
  },

  created() {
    this.pin.length = 0;
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
