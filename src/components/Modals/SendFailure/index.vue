<template>
  <div>
    <q-dialog
      ref="dialog"
      v-model="sendFailureModalOpened"
      persistent
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
      content-class="dark-modal"
    >
      <div>
        <div class="header-section">
          <div class="header-back-button-wrapper">
            <q-btn
              icon="arrow_back"
              size="lg"
              class="icon-btn back-arrow-btn"
              flat
              @click="dismiss"
            />
          </div>
          <h1 class="header-h1">
            {{ $t('error') }}
          </h1>
        </div>
        <div class="modal-layout-wrapper center-modal-content">
          <div class="error-content-wrapper">
            <div class="error-icon-wrapper">
              <q-icon
                name="error_outline"
                class="error-icon"
              />
            </div>

            <div class="error-msg-wrapper">
              <h1>{{ $t('error') }}</h1>
              <h3>{{ $t('sendTxFailure') }}</h3>
            </div>

            <div class="send">
              <q-btn
                :label="$t('close')"
                color="blueish"
                size="md"
                @click="dismiss"
              />
            </div>
          </div>
        </div>
      </div>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'SendFailure',
  computed: {
    sendFailureModalOpened: {
      get() {
        return this.$store.state.modals.sendFailureModalOpened;
      },
      set(value) {
        this.$store.dispatch('modals/setSendFailureModalOpened', value);
      },
    },
  },
  methods: {
    dismiss() {
      this.sendFailureModalOpened = false;
    },
  },
};
</script>

<style scoped>
.error-content-wrapper,
.center-modal-content {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
}

.error-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-icon-wrapper {
  height: 7rem;
  width: 7rem;
  border-radius: 100%;
  text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.5);
  color: red;
}

.error-icon {
  font-size: 8rem;
}

.error-msg-wrapper {
  text-align: center;
  font-family: 'CooperHewitt-SemiboldItalic';
  text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.5);
}

.error-msg-wrapper h1 {
  margin-top: 1.5rem;
}
</style>
