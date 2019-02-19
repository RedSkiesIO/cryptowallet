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
              <h1 class="setup">
                Coins & Tokens
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
                Digital currencies that are secured using cryptography and stored
                on a distributed ledger, blockchain or DAG. It's digital money.
                Used by millions world-wide.
              </p>
            </div>
          </q-carousel-slide>

          <q-carousel-slide class="full-slide">
            <div class="slide-header">
              <h1 class="setup">
                Your wallet
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
                Only you can access your multi-currency crypto-wallet. Your wallet
                holds your coins and tokens, and allows you to easily and securely
                transfer your digital money.
              </p>
            </div>
          </q-carousel-slide>

          <q-carousel-slide class="full-slide">
            <div class="slide-header">
              <h1 class="setup">
                Backup your wallet
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
                Create a list of words to help you recover your wallet, should you
                lose it. We strongly recommend you write these backup words on
                papers and hide these in several secret places or use cryptographic
                algorithm (e.g. Shamir secret sharing techniques).
              </p>
            </div>
          </q-carousel-slide>

          <q-carousel-slide class="full-slide">
            <div class="slide-header">
              <h1 class="setup">
                Security
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
                    You are about to create the wallet. Some security precautions
                    have to be made. Please make sure no one is watching you.
                    Please disconnect from the Internet.
                  </p>
                </div>

                <div :class="{ offline: !online }">
                  <q-alert type="negative">
                    Enable the Airplane Mode or disable your Internet connection before continuing
                  </q-alert>
                </div>
              </div>
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
              v-if="slide !== 3"
              color="yellow"
              text-color="blueish"
              label="next"
              class="splash-btn"
              @click="carousel.next"
            />

            <q-btn
              v-if="slide === 3"
              :disabled="online"
              color="yellow"
              text-color="blueish"
              label="Activate Your Wallet"
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
import { Network } from '@/helpers';

export default {
  name: 'GetStarted',
  data() {
    return {
      getStartedModalOpened: false,
      slide: 0,
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

.slide-wrapper .offline .q-alert {
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
  bottom: 2.6rem;
}

.q-carousel-quick-nav .q-btn.inactive .q-icon,
.q-carousel-quick-nav .q-btn .q-icon {
    font-size: 12px !important;
}

.slide-btn {
  width: 10rem;
}
</style>
