<template>
  <section
    class="main-nav"
  >
    <div class="">
      <router-link
        class="main-nav-link"
        to="/wallet/wallet"
      >
        <i class="svg-icon">
          <img src="~assets/icons/Wallet.svg">
        </i>
        <div>{{ $t('wallet') }}</div>
      </router-link>
    </div>
    <div class="">
      <router-link
        class="main-nav-link"
        to="/wallet/analytics"
      >
        <i class="svg-icon">
          <img src="~assets/icons/Analytics.svg">
        </i>
        <div>{{ $t('analytics') }}</div>
      </router-link>
    </div>
    <div class="">
      <router-link
        class="main-nav-link"
        to="/wallet/payments"
      >
        <i class="svg-icon">
          <img src="~assets/icons/Payments.svg">
        </i>
        <div>{{ $t('payments') }}</div>
      </router-link>
    </div>
    <div class="">
      <router-link
        class="main-nav-link"
        to="/wallet/exchange"
      >
        <i class="svg-icon">
          <img src="~assets/icons/Exchange.svg">
        </i>
        <div>{{ $t('exchange') }}</div>
      </router-link>
    </div>
    <div class="">
      <router-link
        class="main-nav-link"
        to="/wallet/more"
      >
        <i class="svg-icon">
          <img src="~assets/icons/More.svg">
        </i>
        <div>{{ $t('more') }}</div>
      </router-link>

    </div>
  </section>
</template>

<script>
export default {
  name: 'MainNav',
  data() {
    return {
      icon: '/assets/icons/Analytics.svg',
    };
  },
};
</script>

<style scoped>
  .main-nav {
    width: 100%;
    height: 6rem;
    background: white;
    background: #f3f3f3;
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
    color: black;
    width: 100%;
    font-family: 'Montserrat-Regular';
    height: 100%;
  }

  .main-nav-link i {
    font-size: 2.5rem;
  }

  .main-nav-link > div {
    font-size: 0.8rem;
  }

  .router-link-active {
    background: #eaeaea;
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
