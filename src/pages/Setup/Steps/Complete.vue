<template>
  <div>
    <q-btn
      :label="$t('complete')"
      style="color: goldenrod;"
      outline
      @click="complete"
    />
  </div>
</template>

<script>
import { uid } from 'quasar';
import { mapState } from 'vuex';

export default {
  // data() {
  //   return {

  //   };
  // },

  computed: {
    ...mapState({
      setup: state => state.setup,
    }),
  },

  // beforeCreate() {

  // },

  // created() {

  // },

  // beforeMount() {

  // },

  // mounted() {

  // },

  // beforeUpdate() {

  // },

  // updated() {

  // },

  // beforeDestroy() {

  // },

  // destroyed() {

  // },

  methods: {
    /**
     * @TODO document james.
     */
    complete() {
      this.$store
        .dispatch('entities/account/insert', {
          data: {
            uid: uid(),
            salt: this.setup.salt,
            pinHash: this.setup.pinHash,
          },
        }).then(() => {
          this.$router.push({ path: '/' });
        });
    },
  },
};
</script>

<style scoped>
</style>
