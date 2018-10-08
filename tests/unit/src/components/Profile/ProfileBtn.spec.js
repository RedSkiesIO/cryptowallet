import { shallowMount } from '@vue/test-utils';
import ProfileButton from '@/components/Profile/ProfileButton.vue';
<<<<<<< HEAD:tests/unit/src/components/Profile/ProfileBtn.spec.js
import { localVue } from '../../../helpers/setupLocalVue';
import VueI18n from 'vue-i18n'
=======
import { localVue, i18n } from '../setupLocalVue';
>>>>>>> e42e3d0cd06595737cd1d644c1914427b12dd998:tests/unit/Profile/ProfileBtn.spec.js

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

  it('expect router-link button', () => {
    expect(wrapper.contains('#Btn_id')).toBe(true);
  });
});
