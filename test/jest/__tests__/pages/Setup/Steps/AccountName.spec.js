import { mount, shallowMount } from '@vue/test-utils';
import AccountName from '@/pages/Setup/Steps/AccountName';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';

describe('AccountName.vue', () => {
  let router;
  let wrapper;
  let storeMocks;

  const mockGet = [
    {
      name: 'Stephen',
    },
  ];
  const mockAccounts = {
    get: () => { return mockGet; },
  };

  const customStore = {
    getters: {
      'entities/account/query': () => { return () => { return mockAccounts; }; },
    },
    mutations: {},
    actions: {},
    state: {},
  };

  const propsData = {};

  function wrapperInit(options) {
    return mount(AccountName, options);
  }

  function storeInit(custom) {
    storeMocks = createStoreMocks(custom);
    router = createRouter(storeMocks.store);
    router.push({ path: '/setup/0' });
    wrapper = wrapperInit({
      i18n,
      router,
      localVue,
      propsData,
      store: storeMocks.store,
    });
  }

  beforeEach(() => { storeInit(customStore); });

  it('renders and matches snapshot', () => {
    const shallowWrapper = shallowMount(AccountName, {
      i18n,
      router,
      localVue,
      propsData,
      store: storeMocks.store,
    });
    expect(shallowWrapper.element).toMatchSnapshot();
  });

  it('opens the terms modal if a valid account name is used', () => {
    const textInput = wrapper.find('input');
    const submit = wrapper.find('button');
    textInput.setValue('Konrad');
    submit.trigger('click');
    expect(storeMocks.actions.setTermsModalOpened).toHaveBeenCalled();
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
