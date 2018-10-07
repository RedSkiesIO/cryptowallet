import { shallowMount } from '@vue/test-utils';
import ProfileCard from '@/components/Profile/ProfileCard.vue';
import { localVue } from '../setupLocalVue';

describe('ProfileCard.vue', () => {
  let wrapper;

  function wrapperInit(options) {
    return shallowMount(ProfileCard, options);
  }

  beforeEach(() => {
    wrapper = wrapperInit({ localVue });
  });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });


  it('expect main content', () => {
    expect(wrapper.contains('div.mainContentCard')).toBe(true);
  });

  it('expect avatar image', () => {
    expect(wrapper.contains('img#avatar_img_id')).toBe(true);
  });

  it('expect avatars details', () => {
    expect(wrapper.contains('p#profileTitle')).toBe(true);
  });
});
