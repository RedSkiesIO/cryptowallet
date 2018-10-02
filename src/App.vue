<template>
  <div id="q-app">
    <transition
      name="fade"
      mode="out-in"
    >
      <router-view/>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style lang='scss'>

@import 'bulma/sass/utilities/_all.sass';
@import 'bulma/sass/base/_all.sass';
@import 'bulma/sass/layout/_all.sass';
@import 'bulma/sass/elements/button.sass';
@import 'bulma/sass/elements/form.sass';
@import 'bulma/sass/elements/icon.sass';
@import 'bulma/sass/elements/container.sass';
@import 'bulma/sass/elements/content.sass';
@import 'bulma/sass/elements/notification.sass';
@import 'bulma/sass/elements/title.sass';
@import 'bulma/sass/components/card.sass';
@import 'bulma/sass/components/media.sass';
@import 'bulma/sass/grid/columns.sass';

</style>
