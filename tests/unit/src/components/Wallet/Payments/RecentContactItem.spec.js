import { shallowMount } from '@vue/test-utils';
import RecentContactItem from '@/components/Wallet/Payments/RecentContactItem.vue';
import { localVue, i18n } from '../../../../helpers/setupLocalVue';

describe('RecentContactItem.vue', () => {
  let wrapper;

  const propsData = {
    contact: {
      displayName: 'Fio',
    }
  };

  function wrapperInit (options) {
    return shallowMount(RecentContactItem, options);
  }

  function storeInit (custom) {
    wrapper = wrapperInit({ localVue, i18n, propsData });
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
});
