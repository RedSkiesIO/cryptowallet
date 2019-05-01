import OfflineNotice from '@/components/OfflineNotice';
import { mount } from '@vue/test-utils';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';

describe('modals/SendSuccess', () => {
  let wrapper;
  let router;
  let storeMocks;
  let setOnline = true;
  const map = {};

  const mockNotify = {
    notify: jest.fn().mockImplementation((object) => {
      return object.onDismiss;
    }),
  };
  function wrapperInit(options) {
    window.addEventListener = jest.fn((event, cb) => {
      map[event] = cb;
    });
    return mount(OfflineNotice, options);
  }

  function storeInit() {
    storeMocks = createStoreMocks();
    router = createRouter(storeMocks.store);
    router.push({ path: '/' });
    wrapper = wrapperInit({
      i18n,
      router,
      localVue,
      store: storeMocks.store,
      mocks: {
        $q: mockNotify,
      },
    });
  }

  beforeEach(() => {
    Object.defineProperty(window.navigator, 'onLine', { value: setOnline, configurable: true });
    storeInit();
  });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
    setOnline = false;
  });

  it('displays bg-offline class when offline', () => {
    expect(wrapper.contains('.bg-offline')).toBe(true);
    setOnline = true;
  });

  it('displays offline notice if device goes offline', () => {
    map.offline();
    expect(wrapper.vm.online).toBe(false);
    expect(mockNotify.notify).toHaveBeenCalled();
    setOnline = false;
  });

  it('dismisses the offline notice if device reconnects', () => {
    map.online();
    expect(wrapper.vm.online).toBe(true);
    expect(wrapper.vm.dismiss).toBe(null);
    setOnline = true;
  });

  it('checks if device is online periodically', (done) => {
    setTimeout(() => {
      expect(wrapper.vm.online).toBe(true);
      expect(wrapper.vm.dismiss).toBe(null);
      map.offline();
      wrapper.vm.dismiss = () => {};
      setTimeout(() => {
        expect(wrapper.vm.online).toBe(true);

        done();
      }, 10);
    }, 0);
  });
});
