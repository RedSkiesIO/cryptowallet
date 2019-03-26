import { shallowMount } from '@vue/test-utils';
import Pin from '@/pages/Setup/Steps/Pin';
import { localVue, i18n } from '@/helpers/SetupLocalVue';

describe('Pin Setup', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(Pin, {
      i18n, localVue,
    });
  });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });
});
