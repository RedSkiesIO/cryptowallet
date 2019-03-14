import Quasar, * as All from 'quasar';
import Vuex from 'vuex';
import { createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import VueI18n from 'vue-i18n';
import messages from '@/i18n/';
import axios from 'axios';
import { sync } from 'vuex-router-sync';
import errorHandlerPlugin from '@/plugins/ErrorHandler';
import toasterPlugin from '@/plugins/Toaster';
import permissionsPlugin from '@/plugins/Permissions';
import appInvitationPlugin from '@/plugins/AppInvitation';
import smsPlugin from '@/plugins/Sms';
import emailPlugin from '@/plugins/Email';
import contactsImportPlugin from '@/plugins/ContactsImport';

const localVue = createLocalVue();

localVue.use(VueI18n);
localVue.use(Vuex);
localVue.use(Quasar, { components: All, directives: All, plugins: All });
localVue.use(VueRouter);
localVue.prototype.$axios = axios;
errorHandlerPlugin({ Vue: localVue });
toasterPlugin({ Vue: localVue });
permissionsPlugin({ Vue: localVue });
appInvitationPlugin({ Vue: localVue });
smsPlugin({ Vue: localVue });
emailPlugin({ Vue: localVue });
contactsImportPlugin({ Vue: localVue });

/**
 * creates a new router and syncs it with the store using vuex-router-sync
 * @param store
 * @returns router
 */
const createRouter = (store = null) => {
  const router = new VueRouter({
    routes: [
      {
        path: '/contact/:id',
      },
    ],
  });

  if (store) { sync(store, router); }
  return router;
};

const i18n = new VueI18n({ messages, locale: 'en-gb' });

export {
  localVue,
  createRouter,
  i18n,
};
