import { shallowMount } from '@vue/test-utils';
import RecentContacts from '@/components/RecentUsedContacts/RecentContacts.vue';
import RecentContactBox from '@/components/RecentUsedContacts/RecentContactBox.vue';
import { localVue } from '../setupLocalVue';

describe('RecentContacts.vue', () => {
  let wrapper;

  function wrapperInit(options) {
    return shallowMount(RecentContacts, options);
  }

  beforeEach(() => {
    wrapper = wrapperInit({ localVue });
  });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });


  it('expect main content', () => {
    expect(wrapper.contains('.mainContentContacts')).toBe(true);
  });

  it('expect title', () => {
    expect(wrapper.contains('#Title_id')).toBe(true);
  });

  it('expect container', () => {
    expect(wrapper.contains('div.container')).toBe(true);
  });

  it('expect items', () => {
    expect(wrapper.contains('div#items')).toBe(true);
  });

  it('expect item', () => {
    expect(wrapper.contains('div.item')).toBe(true);
  });

  it('expect import contact Box', () => {
    expect(wrapper.contains(RecentContactBox)).toBe(true);
  });
});
