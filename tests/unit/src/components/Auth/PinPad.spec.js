import { shallowMount } from '@vue/test-utils';
import PinPad from '@/components/Auth/PinPad.vue';
import { localVue } from '../../../helpers/setupLocalVue';

describe('Auth/PinPad.vue', () => {
  let wrapper;

  function wrapperInit(options) {
    return shallowMount(PinPad, options);
  }

  beforeEach(() => {
    wrapper = wrapperInit({ localVue });
  });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

});
