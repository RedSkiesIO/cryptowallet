import { shallowMount } from '@vue/test-utils';
import SingleTransaction from '@/components/Wallet/Balance/SingleTransaction.vue';
import { localVue, i18n, createRouter } from '@/../tests/unit/helpers/setupLocalVue.js';
import { __createMocks as createStoreMocks } from '@/../tests/store/__mocks__/store.js';

describe('SingleTransaction.vue', () => {
  let storeMocks;
  let wrapper;
  let store;
  let router;

  const propsData = {
    data: {
      ts: 1539522543102,
      amount: -4.97,
      to: 'Jack Black',
      from: null,
      received: '1CK6KHY6MHgYvmRQ4PAafKYDrg1ejbH1cE',
      tx_hash: '1CK6KHY6MHgYvmRQ4PAafKYDrg1ejbH1cE',
      status: 2,
      tx_fee: '0.000000012',
    }
  };

  function wrapperInit (options) {
    return shallowMount(SingleTransaction, options);
  }

  function storeInit (custom) {
    storeMocks = createStoreMocks(custom);
    router = createRouter(storeMocks.store);
    router.push({ path: `/` });
    wrapper = wrapperInit({ i18n, router, localVue, store: storeMocks.store, propsData });
    store = wrapper.vm.$store;
  }

  beforeEach(() => storeInit());

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('renders the qtimelineentry-stub', () => {
    expect(wrapper.contains('qtimelineentry-stub')).toBe(true);
  });

  it('renders the qcollapsible-stub within qtimelineentry-stub', () => {
    expect(wrapper.contains('qtimelineentry-stub qcollapsible-stub')).toBe(true);
  });

  it('computes and renders title correctly', () => {
    expect(wrapper.vm.$props.data.to).toBeTruthy();
    let title = `To: ${propsData.data.to}`;
    expect(wrapper.contains(`qtimelineentry-stub[title="${title}"]`)).toBe(true);

    const dataCopy = Object.assign({}, propsData.data);
    dataCopy.to = null;
    dataCopy.from = "Gal Anonim";
    wrapper.setProps({data: dataCopy});
    expect(wrapper.vm.$props.data.from).toBeTruthy();
    expect(wrapper.vm.$props.data.to).toBeFalsy();
    title = `From: ${wrapper.vm.$props.data.from}`;
    expect(wrapper.contains(`qtimelineentry-stub[title="${title}"]`)).toBe(true);
  });

  it('computes and renders date correctly', () => {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const day = new Date(wrapper.vm.$props.data.ts).getDate();
      const month = monthNames[new Date(wrapper.vm.$props.data.ts).getMonth()];
      const date = `${day} ${month}`;
      expect(wrapper.contains(`qcollapsible-stub[label="${date}"]`)).toBe(true);
  });

  it('computes and renders the amount correctly', () => {
    let amount = wrapper.vm.$props.data.amount;
    expect(amount < 0).toBe(true);
    expect(wrapper.contains(`qcollapsible-stub.negative-amount[sublabel="&#45; ${Math.abs(amount)}"]`)).toBe(true);

    const dataCopy = Object.assign({}, propsData.data);
    dataCopy.amount = 6.22;
    wrapper.setProps({data: dataCopy});
    amount = wrapper.vm.$props.data.amount;
    expect(amount > 0).toBe(true);
    expect(wrapper.contains(`qcollapsible-stub.positive-amount[sublabel="&#43; ${amount}"]`)).toBe(true);
  });

  it('renders the received data point', () => {
    expect(wrapper.find('.received').text()).toBe(propsData.data.received);
  });

  it('renders the tx_hash data point', () => {
    expect(wrapper.find('.tx-hash').text()).toBe(propsData.data.tx_hash);
  });

  it('computes and renders the status correctly', () => {
    expect(wrapper.vm.$props.data.status).toBe(2);
    expect(wrapper.find('.status.confirmed-tx').text()).toBe('Confirmed');

    let dataCopy = Object.assign({}, propsData.data);
    dataCopy.status = 1;
    wrapper.setProps({data: dataCopy});
    expect(wrapper.vm.$props.data.status).toBe(1);
    expect(wrapper.find('.status.unconfirmed-tx').text()).toBe('Unconfirmed');

    dataCopy = Object.assign({}, propsData.data);
    dataCopy.status = 0;
    wrapper.setProps({data: dataCopy});
    expect(wrapper.vm.$props.data.status).toBe(0);
    expect(wrapper.find('.status').text()).toBe('Pending');
  });

  it('renders the tx_fee data point', () => {
    expect(wrapper.find('.tx-fee').text()).toBe(propsData.data.tx_fee);
  });
});
