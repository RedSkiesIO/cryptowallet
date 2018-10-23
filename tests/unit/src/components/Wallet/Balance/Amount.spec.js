import { shallowMount } from '@vue/test-utils';
import Amount from '@/components/Wallet/Balance/Amount.vue';

describe('Amount.vue', () => {
  let wrapper;

  const propsData = {
    'amount': 10,
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

  it('adds a grey-text class if prop {variant: ["grey"]} is passed', () => {
    wrapper.setProps({variant : ['grey']});
    expect(wrapper.contains('div.amount-box.grey-text')).toBe(true);
  });

  it('renders properly formatted amount', () => {
    expect(wrapper.html().includes('#43; 10.00')).toBe(true);
    wrapper.setProps({amount: -21.2});
    expect(wrapper.html().includes('#8722; 21.20')).toBe(true);

    wrapper.setProps({currency: '£'});
    expect(wrapper.html().includes('#8722; £21.20')).toBe(true);
    wrapper.setProps({amount: 21.2});
    expect(wrapper.html().includes('#43; £21.20')).toBe(true);
  });
});
