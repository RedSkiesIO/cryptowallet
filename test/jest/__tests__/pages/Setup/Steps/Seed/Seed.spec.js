import { mount } from '@vue/test-utils';
import Seed from '@/pages/Setup/Steps/Seed';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';
import bip39 from 'bip39';

jest.mock('bip39');

describe(' Seed.vue', () => {
  let wrapper;
  let store;
  let storeMocks;
  let router;
  const mockSeed = 'real debate another phone response toddler fee offer bundle crack monster earth';

  localVue.use(bip39);

  function wrapperInit(options) {
    return mount(Seed, options);
  }

  function storeInit(custom) {
    bip39.generateMnemonic.mockReturnValue(mockSeed);
    storeMocks = createStoreMocks(custom);
    router = createRouter(storeMocks.store);
    router.push({ path: '/setup/6' });
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
  }

  beforeEach(() => { storeInit(); });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('stores the seed in vuex if valid', () => {
    bip39.generateMnemonic.mockReturnValueOnce(mockSeed);
    expect(storeMocks.actions.setSeed).toHaveBeenCalled();
  });

  it('generates a new seed if invalid', () => {
    const mockInvalidSeed = 'real debate another phone response toddler fee offer bundle crack monster fee';
    const mockValidSeed = 'real debate another phone response toddler fee offer bundle crack monster earth';
    bip39.generateMnemonic.mockReturnValueOnce(mockInvalidSeed);
    bip39.generateMnemonic.mockReturnValueOnce(mockValidSeed);
    storeInit();
    expect(wrapper.vm.seedPhrase).toEqual(mockValidSeed.split(' '));
  });

  it('generates a new seed if try new seed button clicked', () => {
    const mockAnotherSeed = 'connect goose news anxiety frost able rail jacket calm kiwi arch supply';
    bip39.generateMnemonic.mockReturnValueOnce(mockAnotherSeed);
    const newSeedButton = wrapper.findAll('button').at(0);
    newSeedButton.trigger('click');
    expect(wrapper.vm.seedPhrase).toEqual(mockAnotherSeed.split(' '));
  });

  it('opens confirm dialog when done button is clicked', () => {
    bip39.generateMnemonic.mockReturnValueOnce(mockSeed);
    const confirmButton = wrapper.findAll('button').at(1);
    confirmButton.trigger('click');
    expect(wrapper.vm.confirm).toEqual(true);
  });

  it('loads next setup step on done() method', () => {
    bip39.generateMnemonic.mockReturnValueOnce(mockSeed);
    const confirmButton = wrapper.findAll('button').at(1);
    confirmButton.trigger('click');
    expect(wrapper.vm.confirm).toEqual(true);
    wrapper.vm.done();
    expect(wrapper.vm.confirm).toBe(false);
    expect(store.state.route.path).toBe('/setup/7');
  });
});
