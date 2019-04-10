import { mount } from '@vue/test-utils';
import Node from '@/pages/Setup/Steps/Node';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';

describe('Node Setup', () => {
  let wrapper;
  let router;
  let store;
  let storeMocks;

  const propsData = {};

  function wrapperInit(options) {
    return mount(Node, options);
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

  it('skips to the next setup page if "Skip" button is clicked', () => {
    const page = parseInt(store.state.route.params.id, 10);
    wrapper.findAll('.q-btn').at(0).trigger('click');
    expect(parseInt(store.state.route.params.id, 10)).toBe(page + 1);
  });

  describe('"Done" button', () => {
    it('validates the IP Address, if invalid displays toast', () => {
      const input = wrapper.find('input');
      input.element.value = '123.a.123';
      input.trigger('input');

      wrapper.vm.$toast.create = jest.fn();
      wrapper.findAll('.q-btn').at(1).trigger('click');
      expect(wrapper.vm.$toast.create).toHaveBeenCalled();
    });

    it('validates the IP Address, if valid goes to the nest setup page', () => {
      const input = wrapper.find('input');
      input.element.value = '123.123.123.123';
      input.trigger('input');

      const page = parseInt(store.state.route.params.id, 10);
      wrapper.findAll('.q-btn').at(1).trigger('click');
      expect(parseInt(store.state.route.params.id, 10)).toBe(page + 1);
    });
  });
});
