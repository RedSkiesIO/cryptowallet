import { shallowMount } from '@vue/test-utils';
import Amount from '@/components/Wallet/Amount';

describe('Amount.vue', () => {
  let wrapper;

  const propsData = {
    'amount': 10.00,
    'format': '0.00',
  };

  const currencyProps= {
    GBP: {
      symbol: '£',
      name: 'British Pound Sterling',
      symbol_native: '£',
      exponent: 2,
      rounding: 0,
      code: 'GBP',
      name_plural: 'British pounds sterling',
    },
    USD: {
      symbol: '$',
      name: 'US Dollar',
      symbol_native: '$',
      exponent: 2,
      rounding: 0,
      code: 'USD',
      name_plural: 'US dollars',
    }
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

  it('renders positive amount with + sign', () => {
    wrapper.setProps({prependPlusOrMinus: true});
    expect(wrapper.html().includes('+ 10.00')).toBe(true);
  });

  it('renders negative amount with - sign', () => {
    wrapper.setProps({prependPlusOrMinus: true});
    wrapper.setProps({amount: -21.20});
    expect(wrapper.html().includes('- 21.20')).toBe(true);
  });

  it('renders amount with a GBP currency symbol', () => {
    wrapper.setProps({currency: currencyProps.GBP});
    wrapper.setProps({prependPlusOrMinus: true});
    expect(wrapper.html().includes('+ £10.00')).toBe(true);
  });

  it('renders amount with a USD currency symbol', () => {
    wrapper.setProps({currency: currencyProps.USD});
    wrapper.setProps({prependPlusOrMinus: true});
    expect(wrapper.html().includes('+ $10.00')).toBe(true);
  });
});
