<template>
  <div>
    <h1 class="setup">
      {{ $t('pinConfirmationTitle') }}
    </h1>
    <h4 class="setup">
      {{ $t('confirmPin') }}
    </h4>
    <PinPad mode="pin-confirm" />
  </div>
</template>

<script>
import PinPad from '@/components/Auth/PinPad';

export default {
  name: 'PinConfirm',
  components: {
    PinPad,
  },
};

</script>

<style scoped>

</style>
