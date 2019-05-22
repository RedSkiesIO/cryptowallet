<template>
  <div>
    <div class="layout">
      <div class="list">
        <CloudList />
      </div>
      <q-dialog
        v-model="confirm"
        persistent
      >
        <q-card
          style="width: 300px"
          class="dialog"
        >
          <q-card-section>
            <h2>{{ $t('confirm') }}</h2>
            <p class="">
              {{ $t('exitConfirm') }}
            </p>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              v-close-popup
              flat
              :label="$t('cancelConfirm')"
              color="blueish"
            />
            <q-btn
              flat
              :label="$t('acceptConfirm')"
              color="blueish"
              @click="exit"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script>
import CloudList from '@/components/Wallet/CloudList';

export default {
  name: 'Wallet',
  components: {
    CloudList,
  },
  data() {
    return {
      confirm: false,
    };
  },
  beforeRouteLeave(to, from, next) {
    if (to.path === '/' && from.path === '/wallet') {
      this.confirm = true;
      next(false);
    } else {
      next();
    }
  },
  methods: {
    exit() {
      navigator.app.exitApp();
    },
  },
};

</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 2.5rem - 5rem);
}

.list {
  flex: 1;
  position: relative;
}
</style>
