<template>
  <section
    class="main-nav"
  >
    <div class="">
      <router-link
        class="main-nav-link"
        to="/wallet"
      >
        <q-icon name="account_balance_wallet" />
        <div>{{ $t('wallets') }}</div>
      </router-link>
    </div>
    <div class="">
      <router-link
        class="main-nav-link"
        to="/settings"
      >
        <q-icon name="settings" />
        <div>{{ $t('settings') }}</div>
      </router-link>
    </div>
  </section>
</template>

<script>
export default {
  name: 'MainNav',
};
</script>

<style lang="stylus" scoped>
  .main-nav {
    width: 100%;
    height: 4rem;
    background: white;
    border-top: 1px solid lightgrey;
    display: flex;
    justify-content: space-between;
  }

  .main-nav > div {
    flex: 1;
  }

  .main-nav-link {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: slategrey;
    width: 100%;
    font-family: 'Montserrat-Medium';
    height: 100%;
    text-decoration: none;
  }

  .main-nav-link i {
    font-size: 2em;
    margin-bottom: 0.2em;
  }

  .main-nav-link > div {
    font-size: 0.8rem;
  }

  .router-link-exact-active {
    color: $primary;
    font-family: 'Montserrat-Medium';
  }

  .svg-icon {
    width: 100%;
    height: 4rem;
    line-height: 0;
    display: flex;
  }

  .svg-icon img {
    max-width: 75%;
    margin: 0 auto;
  }
</style>
