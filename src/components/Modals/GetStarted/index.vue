<template>
  <div>
    <q-modal
      v-model="getStartedModalOpened"
      class="dark-modal"
    >

      <div class="header-section">
        <div class="header-back-button-wrapper">
          <q-btn
            icon="arrow_back"
            size="lg"
            class="icon-btn back-arrow-btn"
            flat
            @click.prevent="closeModal"
          />
        </div>
        <!-- <h1 class="header-h1">{{ $t('newAccount') }}</h1> -->
      </div>

      <div class="modal-layout-wrapper no-padding">
        <q-carousel
          class="q-carousel-full"
          color="primary"
          quick-nav
          @slide="updateSlideIndex"
        >

          <q-carousel-slide class="full-slide">
            <div class="slide-header">
              <h1 class="setup">Coins & Tokens</h1>
            </div>
            <div class="slide-wrapper">
              Explain what coins are, what tokens are.
            </div>
          </q-carousel-slide>

          <q-carousel-slide class="full-slide">
            <div class="slide-header">
              <h1 class="setup">Wallets</h1>
            </div>
            <div class="slide-wrapper">
              Explain the use of digital wallets.
            </div>
          </q-carousel-slide>

          <q-carousel-slide class="full-slide">
            <div class="slide-header">
              <h1 class="setup">Backup & Security</h1>
            </div>
            <div class="slide-wrapper">
              Explain the significance of the seed.
            </div>
          </q-carousel-slide>

          <q-carousel-control
            slot="control-button"
            slot-scope="carousel"
            :offset="[0, 0]"
            position="bottom"
            class="next-button-wrapper"
          >
            <q-btn
              v-if="slide !== 2"
              color="yellow"
              text-color="blueish"
              label="next"
              class="splash-btn"
              @click="carousel.next"
            />

            <q-btn
              v-if="slide === 2"
              color="yellow"
              text-color="blueish"
              label="Create Wallet"
              class="splash-btn"
              @click="done"
            />
          </q-carousel-control>

        </q-carousel>
      </div>
    </q-modal>
  </div>
</template>

<script>
export default {
  name: 'NewAccount',
  data() {
    return {
      getStartedModalOpened: false,
      slide: 0,
    };
  },
  mounted() {
    this.$root.$on('getStartedModalOpened', (value) => {
      this.getStartedModalOpened = value;
    });
  },
  methods: {
    closeModal() {
      this.$root.$emit('getStartedModalOpened', false);
    },
    done() {
      this.$root.$emit('getStartedModalOpened', false);
      this.$store.dispatch('setup/setAccountType', 'new');
      this.$router.push({ path: '/setup/2' });
    },
    updateSlideIndex(index) {
      this.slide = index;
    },
  },
};
</script>

<style>
.q-carousel-full {
  height: 100%;
}

.q-carousel-quick-nav {
  background: transparent;
  height: 2.5rem;
}

.q-carousel-slide {
  padding: 0;
}

.slide-header {
  height: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.slide-wrapper {
  width: 100%;
  height: calc(100% - 12rem);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 .5rem;
}

.next-button-wrapper {
  text-align: center;
  bottom: 2.6rem;
}

.q-carousel-quick-nav .q-btn.inactive .q-icon,
.q-carousel-quick-nav .q-btn .q-icon {
    font-size: 12px !important;
}

.slide-btn {
  width: 12rem;
}
</style>
