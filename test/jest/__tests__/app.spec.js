/* eslint-disable no-magic-numbers */
import App from '@/App.vue';
import Coin from '@/store/wallet/entities/coin';
import Account from '@/store/wallet/entities/account';
import { shallowMount } from '@vue/test-utils';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';
import SupportedCoins from '@/store/settings/state/supportedCoins.js';

describe('app.vue', () => {
  let wrapper;
  let storeMocks;
  let router;

  const QRScanner = {
    show: jest.fn().mockImplementation((func) => { return func(); }),
    hide: jest.fn().mockImplementation((func) => { return func(); }),
    destroy: jest.fn().mockImplementation((func) => { return func(); }),
  };

  const customStore = {
    state: {
      settings: {
        loading: false,
      },
      qrcode: {
        scanning: false,
      },
    },
    actions: {
      'qrcode/scanQRCode': (context) => {
        context.commit('SCAN_QR_CODE');
      },
      'qrcode/cancelScanning': (context) => {
        context.commit('CANCEL_SCANNING');
      },
    },
    mutations: {
      SCAN_QR_CODE: (state) => {
        state.qrcode.scanning = true;
      },
      CANCEL_SCANNING: (state) => {
        state.qrcode.scanning = false;
      },
    },
  };

  const propsData = {};

  function wrapperInit(options) {
    return shallowMount(App, options);
  }

  function storeInit(custom, path = '/') {
    storeMocks = createStoreMocks(custom);
    router = createRouter(storeMocks.store);
    router.push({ path });
    wrapper = wrapperInit({
      i18n,
      router,
      localVue,
      propsData,
      store: storeMocks.store,
    });
  }

  beforeEach(() => { storeInit(customStore); });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('routes to login screen if user tries to access authenticated page when unauthenticated', (done) => {
    customStore.state.settings.authenticatedAccount = false;
    storeInit(customStore, '/wallet');
    setTimeout(() => {
      expect(router.history.current.path).toBe('/');
      done();
    }, 0);
  });

  it('routes to the setup screen if there are no accounts on loading', (done) => {
    wrapper.vm.settings.loading = true;
    setTimeout(() => {
      expect(router.history.current.path).toBe('/setup/0');
      Account.insert({ data: { id: 1, name: 'Stephen' } });
      wrapper.vm.settings.loading = false;
      setTimeout(() => {
        done();
      }, 0);
    }, 0);
  });

  it('it stores the supported coins in the database if the do not exist on loading', (done) => {
    wrapper.vm.settings.loading = true;
    setTimeout(() => {
      expect(Coin.all().length).toBe(SupportedCoins.length);
      done();
    }, 0);
  });

  it('it launches and cancels the qr code scanner', (done) => {
    global.QRScanner = QRScanner;
    wrapper.vm.$store.dispatch('qrcode/scanQRCode');
    setTimeout(() => {
      expect(QRScanner.show).toHaveBeenCalled();
      wrapper.vm.$store.dispatch('qrcode/cancelScanning');
      setTimeout(() => {
        expect(QRScanner.hide).toHaveBeenCalled();
        expect(QRScanner.destroy).toHaveBeenCalled();
        jest.clearAllMocks();
        global.QRScanner = undefined;
        wrapper.vm.$store.dispatch('qrcode/scanQRCode');
        setTimeout(() => {
          expect(QRScanner.show).toHaveBeenCalledTimes(0);
          wrapper.vm.$store.dispatch('qrcode/cancelScanning');
          setTimeout(() => {
            expect(QRScanner.hide).toHaveBeenCalledTimes(0);
            expect(QRScanner.destroy).toHaveBeenCalledTimes(0);
            done();
          }, 0);
        }, 0);
      }, 0);
    }, 0);
  });
});
