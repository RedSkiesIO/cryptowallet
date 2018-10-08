import { shallowMount } from '@vue/test-utils';
import { localVue } from '../../../helpers/setupLocalVue';
import PinPad from '@/components/Auth/PinPad.vue';

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
