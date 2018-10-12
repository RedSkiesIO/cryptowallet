import { shallowMount } from '@vue/test-utils';
import TxDetails from '@/pages/Transactions/TxDetails.vue';
import { localVue } from '../setupLocalVue';

describe('TxDetails.vue', () => {
  let wrapper;

  function wrapperInit(options) {
    return shallowMount(TxDetails, options);
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

  it('expect table title', () => {
    expect(wrapper.contains('div.table-title')).toBe(true);
  });

  it('expect table', () => {
    expect(wrapper.contains('table.table-fill')).toBe(true);
  });

  it('expect tx hash', () => {
    expect(wrapper.contains('#txHash_id')).toBe(true);
  });

  it('expect tx receipt', () => {
    expect(wrapper.contains('#txReceiptStatus_id')).toBe(true);
  });

  it('expect tx timeStamp', () => {
    expect(wrapper.contains('#timeStamp_id')).toBe(true);
  });

  it('expect tx sender', () => {
    expect(wrapper.contains('#from_id')).toBe(true);
  });

  it('expect tx receiver', () => {
    expect(wrapper.contains('#to_id')).toBe(true);
  });

  it('expect tx value', () => {
    expect(wrapper.contains('#value_id')).toBe(true);
  });

  it('expect   tx Cost Fee', () => {
    expect(wrapper.contains('#txCostFee_id')).toBe(true);
  });

});
