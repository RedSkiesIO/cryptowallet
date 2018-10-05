import { shallowMount } from '@vue/test-utils';
import ProfileButton from '@/components/ProfileButton.vue';
import { localVue } from './setupLocalVue';
import VueI18n from 'vue-i18n'
import Locales from '../../src/i18n';

describe('ProfileButton.vue', () => {
  let wrapper;

  function wrapperInit(options) {
    return shallowMount(ProfileButton, options);
  }

  beforeEach(() => {
    const messages = {
      en: {
        message: {
          hello: 'hello world'
        }
      },
      ja: {
        message: {
          hello: 'こんにちは、世界'
        }
      }
    };
    const i18n = new VueI18n({locale: 'en-us',messages});
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
