import { mount, createLocalVue, shallowMount } from '@vue/test-utils';
import AccountName from '@/pages/Setup/Steps/AccountName';
import { Quasar, QBtn, QInput } from 'quasar';
import { localVue, i18n } from '@/helpers/SetupLocalVue';


describe('AccountName.vue', () => {
  localVue.use(Quasar, { components: { QBtn, QInput } });

  const wrapper = mount(AccountName, {
    i18n, localVue,
  });

  const { vm } = wrapper;

  it('passes the sanity check and creates a wrapper', () => {
    expect(wrapper.isVueInstance()).toBe(true);
  });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('runs validate function', () => {
    const defaultData = AccountName.data();
    const validate = AccountName.methods.validate();
    console.log(validate);
  });
});
