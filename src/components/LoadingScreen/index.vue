<template>
  <div>
    <div
      :class="{done : !show}"
      class="loading background"
    >
      <div class="loading-footer">
        <img
          class="logo-loading"
          src="~/assets/logo-white-horizontal.png"
        >
      </div>
      <Spinner />
    </div>
  </div>
</template>

<script>
import Spinner from '@/components/Spinner';

export default {
  name: 'LoadingScreen',
  components: {
    Spinner,
  },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<style lang='scss'>
.loading {
  height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0!important;
  height: 100%!important;
  z-index: 999999;
  transition: opacity 0.2s ease-in-out;
  transition-delay: 500ms;
}

@keyframes LOADING {
  0%   { opacity: 1; }
  100% { opacity: 0; }
}

.loading.done {
  animation: LOADING 150ms forwards;
  animation-timing-function: ease-out;
  animation-delay: 250ms;
  pointer-events: none;
}

.loading.background {
  border-bottom: none!important;
}

.loading-footer {
  position: absolute;
  width: 10rem;
  height: 5rem;
  bottom: 0;
  opacity: 0.2;
  margin: 0 auto;
  left: 0;
  right: 0;
  text-align: center;
}

.loading-footer.emphasised {
  opacity: 1;
}

.logo-loading {
  width: 8rem;
  height: auto;
  margin: 0 auto;
}
</style>
