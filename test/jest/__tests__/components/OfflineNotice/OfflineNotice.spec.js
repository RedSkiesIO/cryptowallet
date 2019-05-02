/* eslint-disable no-magic-numbers */
import OfflineNotice from '@/components/OfflineNotice';
import { mount } from '@vue/test-utils';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';

describe('modals/SendSuccess', () => {
  let wrapper;
  let router;
  let storeMocks;
  let setOnline = true;
  let mockQ;
  const connection = {
    type: 'none',
  };
  const browserEvents = {};
  const mobileEvents = {};

  function wrapperInit(options) {
    window.addEventListener = jest.fn((event, cb) => {
      browserEvents[event] = cb;
    });
    document.addEventListener = jest.fn((event, cb) => {
      mobileEvents[event] = cb;
    });
    return mount(OfflineNotice, options);
  }

  function storeInit(online = true, device = { desktop: true }) {
    mockQ = {
      notify: jest.fn().mockImplementation((object) => {
        return object.onDismiss;
      }),
      platform: {
        is: null,
      },
    };
    mockQ.platform.is = device;
    setOnline = online;
    if (online) { connection.type = true; } else { connection.type = 'none'; }
    storeMocks = createStoreMocks();
    router = createRouter(storeMocks.store);
    router.push({ path: '/' });
    wrapper = wrapperInit({
      i18n,
      router,
      localVue,
      store: storeMocks.store,
      mocks: {
        $q: mockQ,
        errorHandler: jest.fn(),
      },
    });
  }

  beforeEach(() => {
    Object.defineProperty(window.navigator, 'onLine', { value: setOnline, configurable: true });
    Object.defineProperty(navigator, 'connection', { value: connection, configurable: true });
    jest.clearAllMocks();
  });

  it('renders and matches snapshot', () => {
    storeInit();
    expect(wrapper.element).toMatchSnapshot();
  });

  it('displays bg-offline class when offline', () => {
    storeInit(false);
    expect(wrapper.contains('.bg-offline')).toBe(true);
  });

  it('displays offline notice if a desktop device goes offline', () => {
    storeInit(true);
    browserEvents.offline();
    expect(wrapper.vm.online).toBe(false);
    expect(mockQ.notify).toHaveBeenCalled();
  });

  it('displays an offline notice if a mobile device goes offline', () => {
    storeInit(true, { android: true });
    mobileEvents.offline();
    expect(wrapper.vm.online).toBe(false);
    expect(mockQ.notify).toHaveBeenCalled();
  });

  it('dismisses the offline notice if a desktop device reconnects', (done) => {
    storeInit(false);
    browserEvents.offline();
    setTimeout(() => {
      browserEvents.online();
      expect(wrapper.vm.online).toBe(true);
      expect(wrapper.vm.dismiss).toBe(null);
      done();
    }, 1000);
  });

  it('dismisses the offline notice if a mobile device reconnects', (done) => {
    storeInit(false, { ios: true });

    mobileEvents.offline();
    setTimeout(() => {
      mobileEvents.online();
      expect(wrapper.vm.online).toBe(true);
      expect(wrapper.vm.dismiss).toBe(null);
      done();
    }, 1000);
    setOnline = true;
  });

  it('checks if device is online periodically', (done) => {
    storeInit();
    setTimeout(() => {
      expect(wrapper.vm.online).toBe(true);
      expect(wrapper.vm.dismiss).toBe(null);
      setTimeout(() => {
        wrapper.vm.$options.beforeDestroy[2]();
        done();
      }, 1000);
    }, 1000);
  });

  it('handles errors if platform can\'t be detected', () => {
    storeInit(true, {});
    expect(wrapper.vm.errorHandler).toHaveBeenCalledWith(Error('Platform not detected'));
  });
});
