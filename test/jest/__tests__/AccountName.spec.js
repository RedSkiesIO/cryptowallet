import { mount, createLocalVue, shallowMount } from '@vue/test-utils';
import AccountName from '@/pages/Setup/Steps/AccountName';
import { Quasar, QBtn, QInput } from 'quasar';
import { localVue, i18n } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';


describe('AccountName.vue', () => {
  localVue.use(Quasar, { components: { QBtn, QInput } });
  const storeMocks = createStoreMocks();
  const wrapper = mount(AccountName, {
    i18n, localVue, store: storeMocks.store,
  });
  const store = wrapper.vm.$store;


  const { vm } = wrapper;

  it('passes the sanity check and creates a wrapper', () => {
    expect(wrapper.isVueInstance()).toBe(true);
  });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('runs validate function', () => {
    const textInput = wrapper.find('input');
    const submit = wrapper.find('button');
    textInput.setValue('Stephen');
    submit.trigger('click');
    expect(vm.accountName).toBe('Stephen');
  });
});
