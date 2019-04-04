import { shallowMount } from '@vue/test-utils';
import Setup from '@/pages/Setup';
import { localVue, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';
import bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

describe('Setup.vue', () => {
  let wrapper;
  let store;
  let storeMocks;
  let router;

  function wrapperInit(options) {
    return shallowMount(Setup, options);
  }

  function storeInit(custom) {
    storeMocks = createStoreMocks(custom);
    router = createRouter(storeMocks.store);
    router.push({ path: '/setup/0' });
    wrapper = wrapperInit({
      router,
      localVue,
      store: storeMocks.store,
    });
    store = wrapper.vm.$store;
  }

  beforeEach(() => { storeInit(); });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('generates a salt if one doesn\'t exist', () => {
    store.state.setup.salt = null;
    const mockSalt = '$2a$20$KE46k48NXlqTBgPQUB9bF.';
    bcrypt.genSaltSync.mockReturnValue(mockSalt);
    expect(store.state.setup.salt).toEqual(mockSalt);
  });
});
