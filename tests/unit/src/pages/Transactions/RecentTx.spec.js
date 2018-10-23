import { shallowMount } from '@vue/test-utils';
import RecentTX from '@/components/RecentTX.vue';
import { localVue } from '@/../tests/unit/helpers/setupLocalVue.js';

describe('RecentTX.vue', () => {
  let wrapper;

  function wrapperInit(options) {
    return shallowMount(RecentTX, options);
  }

  beforeEach(() => {
    wrapper = wrapperInit({ localVue });
  });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });


  it('expect main content', () => {
    expect(wrapper.contains('div.container')).toBe(true);
  });

  it('expect button', () => {
    expect(wrapper.contains('#Btn_id')).toBe(true);
  });

  it('expect recent transaction', () => {
    expect(wrapper.contains('p#transaction_id')).toBe(true);
  });
});
