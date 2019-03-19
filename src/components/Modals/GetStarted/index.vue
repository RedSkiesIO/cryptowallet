<template>
  <div>
    <q-dialog
      v-model="getStartedModalOpened"
      persistent
      :maximized="true"
      transition-show="slide-up"
      transition-hide="slide-down"
      content-class="dark-modal"
    >
      <div class="modal-layout-wrapper full no-padding">
        <q-carousel
          v-model="slide"
          class="q-carousel-full"
          transition-prev="slide-right"
          transition-next="slide-left"
          swipeable
          animated
          control-color="white"
          navigation
          padding
        >
          <q-carousel-slide name="coins-tokens" class="full-slide">
            <div class="slide-header">
              <h1 class="setup">
                {{ $t('CoinsTokens') }}
              </h1>
            </div>
            <div class="slide-wrapper">
              <div class="slide-illustration">
                <q-icon
                  name="monetization_on"
                  size="10rem"
                  color="white"
                  class="temp-ill"
                />
              </div>
              <p>
                {{ $t('getStartedCoinsTokens') }}
              </p>
            </div>

            <div class="absolute-bottom">
              <div class="next-button-wrapper">
                <q-btn
                  v-if="slide !== 'security'"
                  :label="$t('next')"
                  color="yellow"
                  text-color="blueish"
                  class="splash-btn"
                  @click="next"
                />
              </div>
            </div>
          </q-carousel-slide>

          <q-carousel-slide name="your-wallet" class="full-slide">
            <div class="slide-header">
              <h1 class="setup">
                {{ $t('yourWallet') }}
              </h1>
            </div>
            <div class="slide-wrapper">
              <div class="slide-illustration">
                <q-icon
                  name="account_balance_wallet"
                  size="10rem"
                  color="white"
                  class="temp-ill"
                />
              </div>
              <p>
                {{ $t('getStartedYourWallet') }}
              </p>
            </div>

            <div class="absolute-bottom">
              <div class="next-button-wrapper">
                <q-btn
                  v-if="slide !== 'security'"
                  :label="$t('next')"
                  color="yellow"
                  text-color="blueish"
                  class="splash-btn"
                  @click="next"
                />
              </div>
            </div>
          </q-carousel-slide>

          <q-carousel-slide name="backup-your-wallet" class="full-slide">
            <div class="slide-header">
              <h1 class="setup">
                {{ $t('backupYourWallet') }}
              </h1>
            </div>
            <div class="slide-wrapper">
              <div class="slide-illustration">
                <q-icon
                  name="storage"
                  size="10rem"
                  color="white"
                  class="temp-ill"
                />
              </div>
              <p>
                {{ $t('getStartedBackupYourWallet') }}
              </p>
            </div>

            <div class="absolute-bottom">
              <div class="next-button-wrapper">
                <q-btn
                  v-if="slide !== 'security'"
                  :label="$t('next')"
                  color="yellow"
                  text-color="blueish"
                  class="splash-btn"
                  @click="next"
                />
              </div>
            </div>
          </q-carousel-slide>

          <q-carousel-slide name="security" class="full-slide">
            <div class="slide-header">
              <h1 class="setup">
                {{ $t('security') }}
              </h1>
            </div>
            <div class="slide-wrapper">
              <div>
                <div>
                  <div class="slide-illustration">
                    <q-icon
                      name="lock"
                      size="10rem"
                      color="white"
                      class="temp-ill"
                    />
                  </div>
                  <p>
                    {{ $t('getStartedSecurity') }}
                  </p>
                </div>
              </div>
            </div>

            <div class="absolute-bottom">
              <div class="next-button-wrapper">
                <div
                  class="banner-wrapper"
                  :class="{ offline: !online }"
                >
                  <q-banner class="negative">
                    {{ $t('enableAirplaneDisableInternet') }}
                  </q-banner>
                </div>

                <q-btn
                  v-if="slide === 'security'"
                  :disabled="online"
                  :label="$t('activateYourWallet')"
                  color="yellow"
                  text-color="blueish"
                  class="splash-btn"
                  @click="done"
                />
              </div>
            </div>
          </q-carousel-slide>
        </q-carousel>
      </div>
    </q-dialog>
  </div>
</template>

<script>
import { Network } from '@/helpers';

export default {
  name: 'GetStarted',
  data() {
    return {
      getStartedModalOpened: false,
      slides: [
        'coins-tokens',
        'your-wallet',
        'backup-your-wallet',
        'security',
      ],
      slide: 'coins-tokens',
      online: null,
    };
  },
  mounted() {
    this.network = new Network();
    this.online = this.network.isOnline();

    this.network
      .on('offline', () => {
        this.online = false;
      })
      .on('online', () => {
        this.online = true;
      });

    this.$root.$on('getStartedModalOpened', (value) => {
      this.getStartedModalOpened = value;
    });
  },
  methods: {
    next() {
      this.slide = this.slides[this.slides.indexOf(this.slide) + 1];
    },
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
  height: calc(100% - 7rem);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 .5rem;
}

.slide-wrapper .q-alert-content {
  font-size: 0.8rem;
}

.slide-wrapper .q-alert {
  margin-top: 1rem;
  transition: all ease-in-out 150ms;
  opacity: 1;
  position: absolute;
  z-index: 100;
  width: calc(100vw - 1rem);
  bottom: -3rem;
}

.q-carousel-inner {
  height: calc(100% - 5.5rem);
  z-index: 2;
}

.q-carousel-slide {
  overflow: visible;
}

.slide-wrapper .offline .q-banner {
  display: none;
}

.banner-wrapper {
  position: absolute;
  z-index: 999;
  margin: 0 1rem;
}

.banner-wrapper.offline {
  display: none;
}

.slide-wrapper .temp-ill {
  height: 10rem;
  margin-top: 0rem;
}

.slide-wrapper .slide-illustration {
  text-align: center;
}

.slide-wrapper p {
  padding: 1rem;
  padding-top: 0.5rem;
  font-size: 0.9rem;
  text-align: center;
  margin-top: 0.5rem;
}

.next-button-wrapper {
  text-align: center;
  bottom: 3.5rem;
  position: relative;
}

.q-carousel-quick-nav .q-btn.inactive .q-icon,
.q-carousel-quick-nav .q-btn .q-icon {
    font-size: 12px !important;
}

.slide-btn {
  width: 10rem;
}
</style>
