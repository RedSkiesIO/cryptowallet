import { shallowMount } from '@vue/test-utils';
import PaymentsGroup from '@/components/RecentPayments/PaymentsGroup.vue';
import Payment from '@/components/RecentPayments/Payment.vue';
import PaymentsGroupHeader from '@/components/RecentPayments/PaymentsGroupHeader.vue';

describe('PaymentsGroup.vue', () => {
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
    return shallowMount(PaymentsGroup, options);
  }

  function storeInit (custom) {
    wrapper = wrapperInit({ propsData });
  }

  beforeEach(() => storeInit());

  it('renders and matches snapshot', () => {
    const wrapper = wrapperInit({ propsData });
    expect(wrapper.element).toMatchSnapshot();
  });

  it('renders a PaymentsGroupHeader component within it', () => {
    expect(wrapper.contains(PaymentsGroupHeader)).toBe(true);
  });

  it('loops through the data and renders enough of Payment components', () => {
    expect(wrapper.findAll(Payment).length).toBe(propsData.group.payments.length);
  });
});
