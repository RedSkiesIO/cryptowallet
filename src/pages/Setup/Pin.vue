<template>
  <div>
    <div>pin setup page</div>
    <pin-pad @:input="input(pin)" />
    <q-btn
      v-if="pin.length >= 6"
      :label="$t('continue')"
      style="color: goldenrod;"
      outline
      @click="hashPin"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import bcrypt from 'bcryptjs';
import PinPad from '../../components/Auth/PinPad.vue';

export default {

  components: {
    PinPad,
  },

  data() {
    return {
      pin: [],
      minLength: 6,
    };
  },

  computed: {
    ...mapState({
      salt: state => state.account.salt,
    }),
  },

  beforeCreate() {

  },

  created() {

  },

  beforeMount() {
    this.$root.$on('inputPin', (p) => {
      this.inputPin(p);
    });
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

    inputPin(p) {
      if (p === '') {
        this.pin.pop();
      } else {
        this.pin.push(p);
      }
    },

    hashPin() {
      bcrypt.hash(
        this.pin.join(''), this.salt,
        (error, hash) => {
          if (error === null) {
            this.$store.dispatch('account/setPin', hash).then(this.$router.push({ path: '/' }));
          } else {
            throw new Error('hash failed');
          }
        },
      );
    },
  },

};

</script>

<style scoped>
</style>
