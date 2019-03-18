<template>
  <div>
    <q-modal
      v-model="termsModalOpened"
      class="light-modal"
    >
      <div class="header-section">
        <h1 class="header-h1">
          {{ $t('termsAndConditions') }}
        </h1>
      </div>

      <div class="modal-layout-wrapper">
        <div class="terms-wrapper">
          <div class="checkbox-wrapper">
            <q-checkbox
              v-model="terms"
              color="primary"
              text-color="primary"
              label="I have read and I accept the Terms & Conditions"
              true-value="yes"
              false-value="no"
              dark
            />
          </div>
        </div>
      </div>
    </q-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Terms',
  data() {
    return {
      termsModalOpened: false,
      terms: 'no',
    };
  },
  computed: {
    ...mapState({
      id: (state) => { return parseInt(state.route.params.id, 10); },
    }),
  },
  watch: {
    terms(val) {
      if (val === 'yes') {
        const delay = 500;
        setTimeout(() => {
          this.$router.push({ path: `/setup/${this.id + 1}` });
          this.termsModalOpened = false;
        }, delay);
      }
    },
  },
  mounted() {
    this.$root.$on('termsModalOpened', (value) => {
      this.termsModalOpened = value;
    });
  },
};
</script>

<style>
.checkbox-wrapper {
  margin-top: 2rem;
  padding: 1rem;
  background: whitesmoke;
  border-radius: 0.3rem;
}

.checkbox-wrapper .q-option-label {
  opacity: 1;
  font-family: Montserrat-Medium;
  margin-left: 0.8rem;
}

.checkbox-wrapper .q-checkbox-icon {
  font-size: 2rem;
}
</style>
