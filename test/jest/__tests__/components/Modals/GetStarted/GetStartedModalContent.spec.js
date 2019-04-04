import { mount } from '@vue/test-utils';
import GetStartedModalContent from '@/components/Modals/GetStarted/GetStartedModalContent';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';

describe('GetStartedModalContent component', () => {
  let wrapper;
  let router;
  let store;
  let storeMocks;

  const delay = 50;

  const defaultProps = {};

  function wrapperInit(options) {
    return mount(GetStartedModalContent, options);
  }

  function storeInit(custom, propsData, parentComponent = null) {
    storeMocks = createStoreMocks(custom);
    router = createRouter(storeMocks.store);
    router.push({ path: '/setup/0' });
    wrapper = wrapperInit({
      i18n,
      router,
      localVue,
      propsData,
      parentComponent,
      store: storeMocks.store,
    });
    store = wrapper.vm.$store;
  }

  beforeEach(() => { storeInit({}, defaultProps); });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('updates state when network status changes', async (done) => {
    window.dispatchEvent(new Event('offline'));

    setTimeout(() => {
      expect(wrapper.vm.online).toBe(false);
      window.dispatchEvent(new Event('online'));

      setTimeout(() => {
        expect(wrapper.vm.online).toBe(true);
        done();
      }, delay);
    }, delay);
  });

  it('switches slides when "NEXT" button is clicked', () => {
    const current = wrapper.vm.slide;
    wrapper.find('.splash-btn').trigger('click');
    expect(wrapper.vm.slide !== current).toBe(true);
  });

  it('enables the "ACTIVATE YOUR WALLET" button when network goes offline; calls done() method when clicked', () => {
    wrapper.vm.slide = 'security';
    expect(wrapper.contains('.splash-btn[disabled=disabled]')).toBe(true);
    window.dispatchEvent(new Event('offline'));
    expect(wrapper.contains('.splash-btn[disabled=disabled]')).toBe(false);
    expect(wrapper.contains('.splash-btn')).toBe(true);

    const doneMock = jest.fn();
    wrapper.setMethods({ done: doneMock });
    wrapper.find('.splash-btn').trigger('click');
    expect(doneMock).toHaveBeenCalled();
  });

  describe('done() method', () => {
    it('dispatches setGetStartedModalOpened with false as payload', () => {
      wrapper.vm.done();
      expect(storeMocks.actions.setGetStartedModalOpened.mock.calls[0][1]).toBe(false);
    });

    it('dispatches setAccountType with \'new\' as payload', () => {
      wrapper.vm.done();
      expect(storeMocks.actions.setAccountType.mock.calls[1][1]).toBe('new');
    });

    it('navigates to /setup/2 path', () => {
      wrapper.vm.done();
      expect(store.state.route.path).toBe('/setup/2');
    });
  });
});
