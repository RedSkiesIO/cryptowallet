<template>
  <div class="columns is-mobile main-nav is-gapless">
    <div class="column">
      <router-link
        class="main-nav-link"
        to="/balance"
      >
        <q-icon name="fas fa-wallet" />
        <div>Balance</div>
      </router-link>
    </div>
    <div class="column">
      <router-link
        class="main-nav-link"
        to="/analytics"
      >
        <q-icon name="fas fa-chart-bar" />
        <div>Analytics</div>
      </router-link>
    </div>
    <div class="column">
      <router-link
        class="main-nav-link"
        to="/payments"
      >
        <q-icon name="fas fa-exchange-alt" />
        <div>Payments</div>
      </router-link>
    </div>
    <div class="column">
      <router-link
        class="main-nav-link"
        to="/exchange"
      >
        <q-icon name="fas fa-sync" />
        <div>Exchange</div>
      </router-link>
    </div>
    <div class="column">
      <router-link
        class="main-nav-link"
        to="/more"
      >
        <q-icon name="fas fa-ellipsis-h" />
        <div>More</div>
      </router-link>

    </div>
  </div>
</template>

<script>
export default {
  name: 'MainNav',
};
</script>

<style scoped>
  .main-nav {
    width: 100%;
    height: 15vh;
  }

  .main-nav > .column {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px;
  }

  .main-nav-link {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: black;
  }

  .main-nav-link i {
    margin-top: 0.3rem;
    font-size: 2.5rem;
  }

  .main-nav-link > div {
    margin-top: 0.5rem;
    font-size: 0.8rem;
  }
</style>
