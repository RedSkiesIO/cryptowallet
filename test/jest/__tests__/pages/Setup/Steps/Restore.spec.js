import { mount } from '@vue/test-utils';
import Restore from '@/pages/Setup/Steps/Restore';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';
import bip39 from 'bip39';
import cordovaMocks from '~/test/CordovaMocks';

describe(' Restore.vue', () => {
  let wrapper;
  let store;
  let storeMocks;
  let router;
  let textInput;
  let nextButton;
  const delay = 500;
  const errorHandler = jest.fn();

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
        errorHandler,
      },
    });
    store = wrapper.vm.$store;
    textInput = wrapper.find('.q-field__native');
    nextButton = wrapper.findAll('button').at(0);
  }
  beforeEach(() => {
    cordovaMocks.initMocks();
    storeInit();
  });

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

  describe('QRScanner', () => {
    it('opens the QR code scanner and dispatches thwe correct actions', (done) => {
      jest.useFakeTimers();
      QRScanner.mockBehaviour = 6;
      wrapper.find('.icon-btn').trigger('click');
      jest.runAllTimers();
      expect(storeMocks.actions.scanQRCode).toHaveBeenCalled();
      expect(storeMocks.actions.setQRMode).toHaveBeenCalled();
      done();
    });

    it('passes the error to erroHandler if scan fails', (done) => {
      jest.useFakeTimers();
      QRScanner.mockBehaviour = 0;
      wrapper.find('.icon-btn').trigger('click');
      jest.runAllTimers();
      expect(errorHandler).toHaveBeenCalled();
      done();
    });

    it('does nothing if device doesn\'t have a camera', async (done) => {
      QRScanner = undefined;
      jest.useFakeTimers();
      wrapper.find('.icon-btn').trigger('click');
      jest.runAllTimers();
      expect(wrapper.vm.seedPhrase).toEqual('');
      done();
    });
  });
});
