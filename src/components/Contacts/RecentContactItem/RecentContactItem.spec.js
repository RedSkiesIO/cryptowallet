import { shallowMount } from '@vue/test-utils';
import RecentContactItem from '@/components/Contacts/RecentContactItem';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';

describe('RecentContactItem.vue', () => {
  let storeMocks;
  let wrapper;
  let store;
  let router;

  const propsData = {
    contact: {
      id: 1,
      displayName: 'Fio',
    }
  };

  function wrapperInit (options) {
    return shallowMount(RecentContactItem, options);
  }

  function storeInit (custom) {
    storeMocks = createStoreMocks(custom);
    router = createRouter(storeMocks.store);
    router.push({ path: `/` });
    wrapper = wrapperInit({ i18n, router, localVue, store: storeMocks.store, propsData });
    store = wrapper.vm.$store;
  }

  beforeEach(() => storeInit());

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('renders a div with .contact-list-item class', () => {
    expect(wrapper.contains('div.contact-list-item')).toBe(true);
  });

  it('renders contacts displayName', () => {
    expect(wrapper.html().includes(propsData.contact.displayName)).toBe(true);
  });

  it('navigates to correct route when clicked on', () => {
    expect(store.state.route.path).toBe('/');
    wrapper.find('.contact-list-item > div').trigger('click');
    expect(store.state.route.path).toBe(`/contact-item/${propsData.contact.id}`);
  });
});
