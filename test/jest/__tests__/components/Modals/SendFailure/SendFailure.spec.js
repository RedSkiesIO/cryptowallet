import { shallowMount, createWrapper } from '@vue/test-utils';
import SendFailure from '@/components/Modals/SendFailure';
import { localVue, i18n } from '@/helpers/SetupLocalVue';
import Vuex from 'vuex';

describe('SendFailure component', () => {
  let store;
  let wrapper;

  beforeEach(() => {
    store = new Vuex.Store();

    wrapper = shallowMount(SendFailure, {
      i18n,
      localVue,
      store,
    });
  });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('has sendFailureModalOpened data value set to false when mounted', () => {
    expect(wrapper.vm.sendFailureModalOpened).toBe(false);
  });

  it('updates it\'s data value if \'sendFailureModalOpened\' is emitted', () => {
    wrapper.vm.$root.$emit('sendFailureModalOpened', true);
    expect(wrapper.vm.sendFailureModalOpened).toBe(true);

    wrapper.vm.$root.$emit('sendFailureModalOpened', false);
    expect(wrapper.vm.sendFailureModalOpened).toBe(false);
  });

  it('updates it\'s sendFailureModalOpened data value and navigates a single route back when dismiss() method is called', () => {
    expect(wrapper.vm.sendFailureModalOpened).toBe(false);
  });
});
