import { mount, shallowMount } from '@vue/test-utils';
import Seed from '@/pages/Setup/Steps/Seed';
import { localVue, i18n } from '@/helpers/SetupLocalVue';
import Vuex from 'vuex';
import bip39 from 'bip39';
import {
  Quasar,
  QBtn,
  QCard,
  QCardSection,
  QCardActions,
  QDialog,
  ClosePopup,
} from 'quasar';

jest.mock('bip39');

describe(' Seed.vue', () => {
  let store;
  let actions;
  let wrapper;
  const mockSeed = 'real debate another phone response toddler fee offer bundle crack monster earth';

  localVue.use(Quasar, {
    components: {
      QBtn,
      QCard,
      QCardSection,
      QCardActions,
      QDialog,
    },
    directives: {
      ClosePopup,
    },
  });
  localVue.use(bip39);

  beforeEach(() => {
    actions = {
      'setup/setSeed': jest.fn(),
    };
    store = new Vuex.Store({
      actions,
      state: {
        settings: {
          id: 2,
        },
      },
    });
  });

  it('renders and matches snapshot', () => {
    bip39.generateMnemonic.mockReturnValueOnce(mockSeed);
    wrapper = shallowMount(Seed, {
      i18n,
      localVue,
      store,
      mocks: {
        bip39,
      },
    });
    expect(wrapper.element).toMatchSnapshot();
  });

  it('stores the seed in vuex if valid', () => {
    bip39.generateMnemonic.mockReturnValueOnce(mockSeed);
    wrapper = shallowMount(Seed, {
      i18n,
      localVue,
      store,
      mocks: {
        bip39,
      },
    });
    expect(actions['setup/setSeed']).toHaveBeenCalled();
  });

  it('generates a new seed if invalid', () => {
    const mockInvalidSeed = 'real debate another phone response toddler fee offer bundle crack monster fee';
    const mockValidSeed = 'real debate another phone response toddler fee offer bundle crack monster earth';
    bip39.generateMnemonic.mockReturnValueOnce(mockInvalidSeed);
    bip39.generateMnemonic.mockReturnValueOnce(mockValidSeed);
    wrapper = shallowMount(Seed, {
      i18n,
      localVue,
      store,
      mocks: {
        bip39,
      },
    });
    expect(wrapper.vm.seedPhrase).toEqual(mockValidSeed.split(' '));
  });

  it('generates a new seed if try new seed button clicked', () => {
    const mockAnotherSeed = 'connect goose news anxiety frost able rail jacket calm kiwi arch supply';
    bip39.generateMnemonic.mockReturnValueOnce(mockSeed);
    bip39.generateMnemonic.mockReturnValueOnce(mockAnotherSeed);
    wrapper = mount(Seed, {
      i18n,
      localVue,
      store,
      mocks: {
        bip39,
      },
    });
    const newSeedButton = wrapper.findAll('button').at(0);
    newSeedButton.trigger('click');
    expect(wrapper.vm.seedPhrase).toEqual(mockAnotherSeed.split(' '));
  });

  it('opens confirm dialog when done button is clicked', () => {
    bip39.generateMnemonic.mockReturnValueOnce(mockSeed);
    wrapper = mount(Seed, {
      i18n,
      localVue,
      store,
      mocks: {
        bip39,
      },
    });
    const confirmButton = wrapper.findAll('button').at(1);
    confirmButton.trigger('click');
    expect(wrapper.vm.confirm).toEqual(true);
  });

  it('loads next setup step when confirm popup is accepted', () => {
    bip39.generateMnemonic.mockReturnValueOnce(mockSeed);
    const $router = {
      push: jest.fn(),
    };
    wrapper = mount(Seed, {
      i18n,
      localVue,
      store,
      mocks: {
        bip39,
        $router,
      },
    });
    const confirmButton = wrapper.findAll('button').at(1);
    confirmButton.trigger('click');
    console.log(wrapper.html());

    // wrapper.vm.$nextTick(() => {
    //   setTimeout(() => {
    //     const doneButton = wrapper.findAll('button').at(1);
    //     // doneButton.trigger('click');
    //     console.log(doneButton.html());
    //     expect($router.push).toHaveBeenCalled();
    //     done();
    //   }, 200);
    // });
  });
});
