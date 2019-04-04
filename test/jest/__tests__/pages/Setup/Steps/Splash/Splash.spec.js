import { mount } from '@vue/test-utils';
import Splash from '@/pages/Setup/Steps/Splash';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';

describe('Splash Setup', () => {
  let wrapper;
  let router;
  let store;
  let storeMocks;

  const propsData = {};

  function wrapperInit(options) {
    return mount(Splash, options);
  }

  function storeInit(custom) {
    storeMocks = createStoreMocks(custom);
    router = createRouter(storeMocks.store);
    router.push({ path: '/setup/0' });
    wrapper = wrapperInit({
      i18n,
      router,
      localVue,
      propsData,
      store: storeMocks.store,
    });
    store = wrapper.vm.$store;
  }

  beforeEach(() => { storeInit(); });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('has en-gb selected by default', () => {
    expect(wrapper.vm.selectedLang.value).toBe('en-gb');
  });

  describe('Get Started button', () => {
    it('dispatches setGetStartedModalOpened with false as payload', () => {
      wrapper.find('.get-started-btn').trigger('click');
      expect(storeMocks.actions.setGetStartedModalOpened.mock.calls[0][1]).toBe(true);
    });
  });

  describe('Import Account button', () => {
    it('sets the locale based on the select input value', async (done) => {
      wrapper.vm.selectedLang = {
        label: 'Greek',
        value: 'gr-gr',
        icon: '/assets/flags/gr-gr.svg',
      };

      wrapper.find('.import-account-btn').trigger('click');
      wrapper.vm.$nextTick(() => {
        expect(wrapper.vm.$i18n.locale).toBe('gr-gr');
        done();
      });
    });

    it('dispatches setup/setAccountLocale action with selected locale value', () => {
      wrapper.find('.import-account-btn').trigger('click');
      expect(storeMocks.actions.setAccountLocale.mock.calls[1][1]).toBe('en-gb');
    });

    it('setup/setAccountType action with \'restored\' as payload', () => {
      wrapper.find('.import-account-btn').trigger('click');
      expect(storeMocks.actions.setAccountType.mock.calls[1][1]).toBe('restored');
    });

    it('navigates to /setup/1 path', () => {
      wrapper.find('.import-account-btn').trigger('click');
      expect(store.state.route.path).toBe('/setup/1');
    });
  });
});
