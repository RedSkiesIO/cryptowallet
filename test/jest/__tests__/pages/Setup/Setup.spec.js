/* eslint-disable no-magic-numbers */
import { mount } from '@vue/test-utils';
import Setup from '@/pages/Setup';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';
import Splash from '@/pages/Setup/Steps/Splash/index.vue';
import AccountName from '@/pages/Setup/Steps/AccountName/index.vue';
import Pin from '@/pages/Setup/Steps/Pin';
import PinConfirm from '@/pages/Setup/Steps/Pin/Confirm';
import Restore from '@/pages/Setup/Steps/Restore';
import Seed from '@/pages/Setup/Steps/Seed';
import SeedConfirm from '@/pages/Setup/Steps/Seed/Confirm';
import Complete from '@/pages/Setup/Steps/Complete';

describe('Setup.vue', () => {
  let wrapper;
  let storeMocks;
  let router;

  function wrapperInit(options) {
    return mount(Setup, options);
  }

  function storeInit(custom, id) {
    storeMocks = createStoreMocks(custom);
    router = createRouter(storeMocks.store);
    router.push({ path: `/setup/${id}` });
    wrapper = wrapperInit({
      router,
      localVue,
      i18n,
      store: storeMocks.store,
    });
  }

  it('renders and matches snapshot', () => {
    storeInit({}, 0);
    expect(wrapper.element).toMatchSnapshot();
  });

  it('generates a salt if one doesn\'t exist', () => {
    storeInit({}, 0);
    const customStore = {
      state: {
        setup: {
          salt: null,
        },
      },
    };
    storeInit(customStore);
    expect(storeMocks.actions.setSalt).toHaveBeenCalled();
  });

  it('mounts the splash component', () => {
    storeInit({}, 0);
    expect(wrapper.contains(Splash)).toBe(true);
  });

  it('mounts the restore component', () => {
    storeInit({}, 1);
    expect(wrapper.contains(Restore)).toBe(true);
  });

  it('mounts the seed component', () => {
    storeInit({}, 2);
    expect(wrapper.contains(Seed)).toBe(true);
  });

  it('mounts the seed confirmed component', () => {
    storeInit({}, 3);
    expect(wrapper.contains(SeedConfirm)).toBe(true);
  });

  it('mounts the pin component', () => {
    storeInit({}, 4);
    expect(wrapper.contains(Pin)).toBe(true);
  });

  it('mounts the pin confirmed component', () => {
    storeInit({}, 5);
    expect(wrapper.contains(PinConfirm)).toBe(true);
  });

  it('mounts the account name component', () => {
    storeInit({}, 6);
    expect(wrapper.contains(AccountName)).toBe(true);
  });

  it('mounts the complete component', () => {
    storeInit({}, 7);
    expect(wrapper.contains(Complete)).toBe(true);
  });
});
