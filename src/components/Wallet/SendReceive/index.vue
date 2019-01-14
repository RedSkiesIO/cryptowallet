<template>
  <section class="send-receive-box">
    <q-btn
      :label="$t('send')"
      color="primary"
      size="lg"
      @click="send"
    />

    <q-btn
      :label="$t('receive')"
      color="primary"
      size="lg"
      @click="receive"
    />
  </section>
</template>

<script>
export default {
  name: 'SendReceive',
  props: {
    wallet: {
      type: Object,
      required: true,
    },
  },
  methods: {
    send() {
      this.$router.push({ path: `/wallet/send/${this.wallet.id}` });
    },
    receive() {
      this.$router.push({ path: `/wallet/receive/${this.wallet.id}` });
    },
  },
};
</script>

<style lang="scss" scoped>
.send-receive-box {
  height: 8vh;
  display: flex;

  button {
    border-radius: 0;
    width: 50%;
  }
}
</style>
