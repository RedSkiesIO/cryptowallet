<template>
  <!-- eslint-disable -->
  <section
    class="main-nav"
  >
    <div class="">
      <router-link
        class="main-nav-link"
        to="/wallet"
      >
        <q-icon name="account_balance_wallet" />

        <!-- <i class="svg-icon">
          <img src="~assets/icons/Wallet.svg">
        </i> -->
        <div>{{ $t('wallets') }}</div>
      </router-link>
    </div>
<!--     <div class="">
      <router-link
        class="main-nav-link"
        to="/wallet/analytics"
      >
        <q-icon name="show_chart" />
        <i class="svg-icon">
          <img src="~assets/icons/Analytics.svg">
        </i>
        <div>{{ $t('analytics') }}</div>
      </router-link>
    </div> -->
<!--     <div class="">
      <router-link
        class="main-nav-link"
        to="/wallet/payments"
      >
        <i class="svg-icon">
          <img src="~assets/icons/Payments.svg">
        </i>
        <div>{{ $t('payments') }}</div>
      </router-link>
    </div> -->
    <div class="">
      <router-link
        class="main-nav-link"
        to="/wallet/exchange"
      >
        <q-icon name="cached" />
        <!-- <i class="svg-icon">
          <img src="~assets/icons/Exchange.svg">
        </i> -->
        <div>{{ $t('exchange') }}</div>
      </router-link>
    </div>
    <div class="">
      <router-link
        class="main-nav-link"
        to="/settings"
      >
        <q-icon name="settings" />
        <!-- <i class="svg-icon">
          <img src="~assets/icons/Exchange.svg">
        </i> -->
        <div>{{ $t('settings') }}</div>
      </router-link>
    </div>
<!--     <div class="">
      <router-link
        class="main-nav-link"
        to="/wallet/more"
      >
        <i class="svg-icon">
          <img src="~assets/icons/More.svg">
        </i>
        <div>{{ $t('more') }}</div>
      </router-link>

    </div> -->
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
    height: 5rem;
    background: #1e3c57;
    display: flex;
    justify-content: space-between;
    border-top: 0.3rem solid #4e677d;
    text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.5);
  }

  .main-nav > div {
    flex: 1;
  }

  .main-nav-link {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
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
    color: #fabc57;
    font-family: 'Montserrat-Medium';
  }

/*  .router-link-active i {
    color: #de4662;
  }*/

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
