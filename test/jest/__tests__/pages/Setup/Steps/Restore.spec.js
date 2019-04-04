import { mount } from '@vue/test-utils';
import Restore from '@/pages/Setup/Steps/Restore';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';
import bip39 from 'bip39';

describe(' Restore.vue', () => {
  let wrapper;
  let store;
  let storeMocks;
  let router;
  let textInput;
  let nextButton;
  const delay = 500;


  localVue.use(bip39);

  function wrapperInit(options) {
    return mount(Restore, options);
  }

  function storeInit(custom) {
    storeMocks = createStoreMocks(custom);
    router = createRouter(storeMocks.store);
    router.push({ path: '/setup/2' });
    wrapper = wrapperInit({
      i18n,
      router,
      localVue,
      store: storeMocks.store,
      mocks: {
        bip39,
      },
    });
    store = wrapper.vm.$store;
    textInput = wrapper.find('.q-field__native');
    nextButton = wrapper.findAll('button').at(0);
  }
  beforeEach(() => { storeInit(); });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('validates if an entered mnemonic is the required length', () => {
    wrapper.vm.$toast.create = jest.fn();
    const invalidSeed = 'real debate another phone response toddler fee offer bundle crack monster';
    textInput.setValue(invalidSeed);
    nextButton.trigger('click');
    expect(wrapper.vm.$toast.create).toHaveBeenCalledWith(10, wrapper.vm.$t('notEnoughWords'), delay);
  });

  it('validates if an entered mnemonic is valid', () => {
    wrapper.vm.$toast.create = jest.fn();
    const invalidSeed = 'real debate another phone response toddler fee offer bundle crack monster eartw';
    textInput.setValue(invalidSeed);
    nextButton.trigger('click');
    expect(wrapper.vm.$toast.create).toHaveBeenCalledWith(10, wrapper.vm.$t('invalidSeedPhrase'), delay);
  });

  it('adds mnemonic to the store and goes to next setup step if valid', () => {
    const validSeed = 'real debate another phone response toddler fee offer bundle crack monster earth';
    textInput.setValue(validSeed);
    nextButton.trigger('click');
    expect(storeMocks.actions.setSeed).toHaveBeenCalled();
    expect(store.state.route.path).toBe('/setup/4');
  });
});
