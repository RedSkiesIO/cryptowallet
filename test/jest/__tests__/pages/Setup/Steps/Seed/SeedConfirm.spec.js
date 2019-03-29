/* eslint-disable no-magic-numbers */
import { mount } from '@vue/test-utils';
import SeedConfirm from '@/pages/Setup/Steps/Seed/Confirm';
import { localVue, createRouter, i18n } from '@/helpers/SetupLocalVue';
import Vuex from 'vuex';
import {
  Quasar,
  QBtn,
} from 'quasar';

describe(' SeedConfirm.vue', () => {
  let store;
  let getters;
  let wrapper;
  const mockSeed = {
    real: 'real', debate: 'debate', another: 'another', phone: 'phone', response: 'response', toddler: 'toddler', fee: 'fee', offer: 'offer', bundle: 'bundle', crack: 'crack', monster: 'monster', earth: 'earth',
  };
  const shuffledSeed = ['debate', 'monster', 'another', 'crack', 'bundle', 'phone', 'response', 'offer', 'toddler', 'fee', 'real', 'earth'];

  localVue.use(Quasar, {
    components: {
      QBtn,
    },
  });
  const router = createRouter();
  router.push({ path: '/' });

  beforeEach(() => {
    getters = {
      'setup/getShuffledSeed': () => { return shuffledSeed; },
    };
    store = new Vuex.Store({
      getters,
      state: {
        settings: {
          id: 2,
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
      router,
    });
  });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
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

  it('goes to the next setup step if seed is entered in correct order', (done) => {
    wrapper.vm.$router.push = jest.fn();
    wrapper.vm.$nextTick(() => {
      const correctOrder = [10, 0, 2, 5, 6, 8, 9, 7, 4, 3, 1, 11];
      correctOrder.forEach((number) => {
        const button = wrapper.findAll('button').at(number);
        button.trigger('click');
      });
      setTimeout(() => {
        expect().toHaveBeenCalled();
        done();
      }, 501);
    });
  });
});
