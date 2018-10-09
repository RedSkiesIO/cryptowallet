import { shallowMount } from '@vue/test-utils';
import Amount from '@/components/Wallet/Amount.vue';
import PaymentsGroupHeader from '@/components/Wallet/PaymentsGroupHeader.vue';

describe('PaymentsGroupHeader.vue', () => {
  let wrapper;

  const propsData = {
    group: {
      date: '26 November',
      payments: [
        {
          ts: 1539527543000,
          title: 'Amazon',
          amount: -10.00,
        },
        {
          ts: 1539144743000,
          title: 'Motion',
          amount: -47.97,
        },
      ],
    },
  };

  function wrapperInit (options) {
    return shallowMount(PaymentsGroupHeader, options);
  }

  function storeInit (custom) {
    wrapper = wrapperInit({ propsData });
  }

  beforeEach(() => storeInit());

  it('renders and matches snapshot', () => {
    const wrapper = wrapperInit({ propsData });
    expect(wrapper.element).toMatchSnapshot();
  });

  it('renders a div with .payments-group-header class', () => {
    expect(wrapper.contains('div.payments-group-header')).toBe(true);
  });

  it('renders a group date string', () => {
    expect(wrapper.html().includes(propsData.group.date)).toBe(true);
  });

  it('renders an Amount component within it', () => {
    expect(wrapper.contains(Amount)).toBe(true);
  });

  it('computes and renders the total balance change', () => {
    expect(wrapper.html().includes('57.97')).toBe(true);
  });
});
