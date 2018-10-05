import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import RecentPayments from '@/components/RecentPayments/RecentPayments.vue';
import PaymentsGroup from '@/components/RecentPayments/PaymentsGroup.vue';
import { __createMocks as createStoreMocks } from '@/../tests/store/__mocks__/store.js';

const localVue = createLocalVue();
localVue.use(Vuex);

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

describe('RecentPayments.vue', () => {
  let storeMocks;
  let wrapper;
  let store;

  function wrapperInit (options) {
    return shallowMount(RecentPayments, options);
  }

  function storeInit (custom) {
    storeMocks = createStoreMocks(custom);
    wrapper = wrapperInit({ localVue, store: storeMocks.store });
    store = wrapper.vm.$store;
  }

  beforeEach(() => storeInit());

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('renders a section with .recent-payments class', () => {
    expect(wrapper.contains('section.recent-payments')).toBe(true);
  });

  it('loops through the data and renders multiple PaymentsGroup components', () => {
    expect(wrapper.findAll(PaymentsGroup).length).toBeGreaterThan(1);
  });

  it('it computes groupedPayments correctly', () => {
    expect(wrapper.vm.groupedPayments.length).toBe(3);

    wrapper.vm.groupedPayments.forEach((group) => {
      expect(group.payments.length > 0).toBe(true);

      group.payments.forEach((payment) => {
        const day = new Date(payment.ts).getDate();
        const month = monthNames[new Date(payment.ts).getMonth()];
        const paymentDate = `${day} ${month}`;
        expect(paymentDate === group.date).toBe(true);
      });
    });
  });
});
