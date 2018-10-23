import { shallowMount } from '@vue/test-utils';
import UserProfile from '@/pages/Profile/UserProfile.vue';
import { localVue } from '@/../tests/unit/helpers/setupLocalVue.js';
import ProfileCard from '@/components/Profile/ProfileCard.vue';

describe('UserProfile.vue', () => {
  let wrapper;

  function wrapperInit(options) {
    return shallowMount(UserProfile, options);
  }

  beforeEach(() => {
    wrapper = wrapperInit({ localVue });
  });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });


  it('expect back button', () => {
    expect(wrapper.contains('button#backButton_id')).toBe(true);
  });

  it('expect mainContent', () => {
    expect(wrapper.contains('div.mainContent')).toBe(true);
  });

  it('expect ProfileCard component', () => {
    expect(wrapper.contains(ProfileCard)).toBe(true);
  });

  it('expect all main buttons to appear', () => {
    expect(wrapper.contains('div#profileButtons_id')).toBe(true);
  });

  it('expect router-link edit button', () => {
    expect(wrapper.contains('#editBtn_id')).toBe(true);
  });
});
