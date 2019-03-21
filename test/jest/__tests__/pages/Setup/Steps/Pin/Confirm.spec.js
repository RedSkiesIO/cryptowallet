import { shallowMount } from '@vue/test-utils';
import PinConfirm from '@/pages/Setup/Steps/Pin/Confirm';
import { localVue, i18n } from '@/helpers/SetupLocalVue';

describe('Pin Setup', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(PinConfirm, {
      i18n, localVue,
    });
  });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });
  // it('renders the PinPad component', () => {
  //   expect(wrapper.find(PinPad).exists()).toBe(true);
  // });
});
