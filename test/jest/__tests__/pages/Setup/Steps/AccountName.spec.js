import { mount, shallowMount, createWrapper } from '@vue/test-utils';
import AccountName from '@/pages/Setup/Steps/AccountName';
import { Quasar, QBtn, QInput } from 'quasar';
import { localVue, i18n } from '@/helpers/SetupLocalVue';
import Vuex from 'vuex';

describe('AccountName.vue', () => {
  let store;
  let actions;
  let getters;
  let wrapper;

  localVue.use(Quasar, { components: { QBtn, QInput } });

  beforeEach(() => {
    const mockGet = [
      {
        name: 'Stephen',
      },
    ];
    const mockAccounts = {
      get: () => { return mockGet; },
    };
    getters = {
      'entities/account/query': () => { return () => { return mockAccounts; }; },
    };
    actions = {
      'setup/setAccountName': jest.fn(),
    };
    store = new Vuex.Store({
      state: {
        settings: {
          delay: 500,
        },
      },
      actions,
      getters,
    });
    wrapper = mount(AccountName, {
      i18n, localVue, store,
    });
  });

  it('renders and matches snapshot', () => {
    const shallowWrapper = shallowMount(AccountName, {
      i18n, localVue, store,
    });
    expect(shallowWrapper.element).toMatchSnapshot();
  });

  it('opens the terms modal if a valid account name is used', () => {
    const textInput = wrapper.find('input');
    const submit = wrapper.find('button');
    textInput.setValue('Konrad');
    submit.trigger('click');
    const rootWrapper = createWrapper(wrapper.vm.$root);
    expect(rootWrapper.emitted('termsModalOpened')).toEqual([[true]]);
  });

  it('displays an error toast if no name is entered', () => {
    wrapper.vm.$toast.create = jest.fn();
    const submit = wrapper.find('button');
    submit.trigger('click');
    expect(wrapper.vm.$toast.create).toHaveBeenCalled();
  });

  it('displays an error toast if account name has already been used', () => {
    wrapper.vm.$toast.create = jest.fn();
    const textInput = wrapper.find('input');
    const submit = wrapper.find('button');
    textInput.setValue('Stephen');
    submit.trigger('click');
    expect(wrapper.vm.$toast.create).toHaveBeenCalled();
  });
});
