import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import VueI18n from 'vue-i18n';
import messages from '@/i18n/';
import axios from 'axios';
import { sync } from 'vuex-router-sync';
import CWCrypto from '@/boot/CWCrypto';
import errorHandlerPlugin from '@/boot/ErrorHandler';
import toasterPlugin from '@/boot/Toaster';
import vueSelectPlugin from '@/boot/VueSelect';
import vuelidatePlugin from '@/boot/Vuelidate';
import walletDiscoveryPlugin from '@/boot/WalletDiscovery';
import accountInitializerPlugin from '@/boot/AccountInitializer/';
import cryptoWalletSDKPlugin from '@/boot/CryptoWalletSDK';


import * as All from 'quasar';

const { Quasar, ClosePopup } = All;

const components = Object.keys(All).reduce((object, key) => {
  const val = All[key];
  if (val && val.component && val.component.name != null) {
    object[key] = val;
  }
  return object;
}, {});

const localVue = createLocalVue();
localVue.use(Quasar, { components, directives: { ClosePopup } });
localVue.use(VueI18n);
localVue.use(Vuex);
localVue.use(VueRouter);
localVue.prototype.$axios = axios;
CWCrypto({ Vue: localVue });
errorHandlerPlugin({ Vue: localVue });
toasterPlugin({ Vue: localVue });
vueSelectPlugin({ Vue: localVue });
vuelidatePlugin({ Vue: localVue });
walletDiscoveryPlugin({ Vue: localVue });
accountInitializerPlugin({ Vue: localVue });
cryptoWalletSDKPlugin({ Vue: localVue });

/**
 * creates a new router and syncs it with the store using vuex-router-sync
 * @param store
 * @returns router
 */
const createRouter = (store = null) => {
  const router = new VueRouter({
    routes: [
      {
        path: '/',
      },
      {
        path: '/setup/:id',
      },
      {
        path: '/wallet/single/send/:id',
      },
      {
        path: '/wallet/single/:id',
      },
    ],
  });

  if (store) {
    sync(store, router);
  }
  return router;
};

const i18n = new VueI18n({ messages, locale: 'en-gb' });

export {
  localVue,
  createRouter,
  i18n,
};
