import { shallowMount } from '@vue/test-utils';
import Amount from '@/components/Wallet/SharedComponents/Amount.vue';

describe('Amount.vue', () => {
  let wrapper;

  const propsData = {
    'amount': 10,
    'format': '0.00',
  };

  function wrapperInit (options) {
    return shallowMount(Amount, options);
  }

  function storeInit (custom) {
    wrapper = wrapperInit({ propsData });
  }

  beforeEach(() => storeInit());

  it('renders and matches snapshot', () => {



    expect(wrapper.element).toMatchSnapshot();
  });

  it('renders a div with .amount-box class', () => {
    expect(wrapper.contains('div.amount-box')).toBe(true);
  });

  it('renders properly formatted amount', () => {
    wrapper.setProps({prependPlusOrMinus: true});
    expect(wrapper.html().includes('+ 10.00')).toBe(true);
    wrapper.setProps({amount: -21.2});
    expect(wrapper.html().includes('- 21.20')).toBe(true);

    wrapper.setProps({amount: 21.2});
    wrapper.setProps({currency: 'GPB'});
    expect(wrapper.html().includes('+ £21.20')).toBe(true);
    wrapper.setProps({amount: -21.2});
    expect(wrapper.html().includes('- £21.20')).toBe(true);
  });
});
