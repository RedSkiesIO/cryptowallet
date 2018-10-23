import { shallowMount } from '@vue/test-utils';
import ProfileButton from '@/components/Profile/ProfileButton.vue';
import { localVue, i18n } from '@/../tests/unit/helpers/setupLocalVue.js';

describe('ProfileButton.vue', () => {
  let wrapper;

  function wrapperInit(options) {
    return shallowMount(ProfileButton, options);
  }

  beforeEach(() => {
    wrapper = wrapperInit({ localVue, i18n });
  });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });


  it('expect main content', () => {
    expect(wrapper.contains('div.profileButton')).toBe(true);
  });

});
