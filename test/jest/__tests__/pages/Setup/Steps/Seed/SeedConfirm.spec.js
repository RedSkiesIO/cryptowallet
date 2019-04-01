/* eslint-disable no-magic-numbers */
import { mount, shallowMount } from '@vue/test-utils';
import SeedConfirm from '@/pages/Setup/Steps/Seed/Confirm';
import { localVue, i18n } from '@/helpers/SetupLocalVue';
import Vuex from 'vuex';
import {
  Quasar,
  QBtn,
} from 'quasar';

describe(' SeedConfirm.vue', () => {
  const mockSeed = {
    real: 'real', debate: 'debate', another: 'another', phone: 'phone', response: 'response', toddler: 'toddler', fee: 'fee', offer: 'offer', bundle: 'bundle', crack: 'crack', monster: 'monster', earth: 'earth',
  };
  const shuffledSeed = ['debate', 'monster', 'another', 'crack', 'bundle', 'phone', 'response', 'offer', 'toddler', 'fee', 'real', 'earth'];
  const delay = 501;
  let store;
  let getters;
  let wrapper;
  let $router;

  localVue.use(Quasar, {
    components: {
      QBtn,
    },
  });

  beforeEach(() => {
    $router = {
      push: jest.fn(),
    };
    getters = {
      'setup/getShuffledSeed': () => { return shuffledSeed; },
    };
    store = new Vuex.Store({
      getters,
      state: {
        route: {
          params: {
            id: 2,
          },
        },
        settings: {
          delay: {
            normal: 500,
          },
        },
        setup: {
          seed: mockSeed,
        },
      },
    });
    wrapper = mount(SeedConfirm, {
      i18n,
      localVue,
      store,
      mocks: {
        $router,
      }
      ,
    });
  });

  it('renders and matches snapshot', () => {
    const shallowWrapper = shallowMount(SeedConfirm, {
      i18n,
      localVue,
      store,
    });
    expect(shallowWrapper.element).toMatchSnapshot();
  });

  it('displays the seed words shuffled', () => {
    expect(wrapper.vm.shuffledSeed).toEqual(shuffledSeed);
    shuffledSeed.forEach((word, i) => {
      const button = wrapper.findAll('button').at(i);
      expect(button.text()).toBe(word);
    });
  });

  it('displays a selected seed word in the seed input box', (done) => {
    const button = wrapper.findAll('button').at(0);
    button.trigger('click');
    const input = wrapper.find('.seed-input-preview-box');
    wrapper.vm.$nextTick(() => {
      expect(input.text()).toBe(shuffledSeed[0]);
      done();
    });
  });

  it('goes to the next setup step if seed is entered in the correct order', (done) => {
    wrapper.vm.$nextTick(() => {
      const correctOrder = [10, 0, 2, 5, 6, 8, 9, 7, 4, 3, 1, 11];
      correctOrder.forEach((number) => {
        const button = wrapper.findAll('button').at(number);
        button.trigger('click');
      });
      setTimeout(() => {
        expect($router.push).toHaveBeenCalledWith({ path: '/setup/3' });
        done();
      }, delay);
    });
  });

  it('displays an error toast if seed is entered in the incorrect order', (done) => {
    wrapper.vm.$toast.create = jest.fn();
    wrapper.vm.$nextTick(() => {
      const incorrectOrder = [10, 0, 2, 5, 3, 8, 9, 7, 4, 6, 1, 11];
      incorrectOrder.forEach((number) => {
        const button = wrapper.findAll('button').at(number);
        button.trigger('click');
      });
      setTimeout(() => {
        expect(wrapper.vm.$toast.create).toHaveBeenCalled();
        done();
      }, delay);
    });
  });

  it('the reset button clears the input box and enables all the word buttons', (done) => {
    wrapper.vm.$nextTick(() => {
      const someButtons = [10, 0, 2, 5, 6];
      someButtons.forEach((number) => {
        const button = wrapper.findAll('button').at(number);
        button.trigger('click');
      });
      const resetButton = wrapper.findAll('button').at(12);
      resetButton.trigger('click');
      expect(wrapper.vm.pipSeq).toEqual([]);
      expect(wrapper.vm.seedPhrase).toEqual([]);
      done();
    });
  });
});
