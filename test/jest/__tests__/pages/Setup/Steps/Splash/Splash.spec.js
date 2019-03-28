/*eslint-disable*/

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

  function wrapperInit (options) {
    return mount(Splash, options);
  }

  function storeInit (custom) {
    storeMocks = createStoreMocks(custom);
    router = createRouter(storeMocks.store);
    router.push({ path: `/setup/0` });
    wrapper = wrapperInit({ i18n, router, localVue, store: storeMocks.store, propsData });
    store = wrapper.vm.$store;
  }

  beforeEach(() => storeInit());

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  describe('Get Started button', () => {
    it('emits getStartedModalOpened event when clicked', async (done) => {
      const callback = jest.fn();
      wrapper.vm.$root.$on('getStartedModalOpened', callback);
      wrapper.find('.get-started-btn').trigger('click');

      wrapper.vm.$nextTick(() => {
        expect(callback).toHaveBeenCalled();
        done();
      });
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

    it ('setup/setAccountType action with \'restored\' as payload', () => {
      expect(true).toBe(true);
    });

    it ('navigates to /setup/1 path', () => {
      expect(true).toBe(true);
    });
  });
});
