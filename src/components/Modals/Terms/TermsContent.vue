<template>
  <div>
    <div class="header-section">
      <h1 class="header-h1">
        {{ $t('termsAndConditions') }}
      </h1>
    </div>

    <div class="modal-layout-wrapper">
      <div class="terms-wrapper">
        <div class="checkbox-wrapper">
          <q-checkbox
            v-model="terms1"
            color="primary"
            text-color="primary"
            :label="$t('termsBox1')"
          />
        </div>
        <div class="checkbox-wrapper">
          <q-checkbox
            v-model="terms2"
            color="primary"
            text-color="primary"
            :label="$t('termsBox2')"
          />
        </div>
        <div class="checkbox-wrapper">
          <q-checkbox
            v-model="terms3"
            color="primary"
            text-color="primary"
            :label="$t('termsBox3')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Terms',
  data() {
    return {
      termsModalOpened: false,
      terms1: false,
      terms2: false,
      terms3: false,
    };
  },
  computed: {
    ...mapState({
      id: (state) => { return parseInt(state.route.params.id, 10); },
    }),
    allTerms() {
      return this.terms1 && this.terms2 && this.terms3;
    },
  },
  watch: {
    allTerms(val) {
      if (val) {
        const delay = 500;
        setTimeout(() => {
          this.$router.push({ path: `/setup/${this.id + 1}` });
          this.$store.dispatch('modals/setTermsModalOpened', false);
        }, delay);
      }
    },
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

.checkbox-wrapper .q-checkbox__label {
  opacity: 1;
  font-family: Inter-Medium;
  margin-left: 0.8rem;
}

.checkbox-wrapper .q-checkbox-icon {
  font-size: 2rem;
}
</style>
