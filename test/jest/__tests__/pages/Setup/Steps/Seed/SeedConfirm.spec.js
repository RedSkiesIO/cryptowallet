/* eslint-disable no-magic-numbers */
import { mount } from '@vue/test-utils';
import SeedConfirm from '@/pages/Setup/Steps/Seed/Confirm';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';


describe('SeedConfirm.vue', () => {
  const shuffledSeed = ['debate', 'monster', 'another', 'crack', 'bundle', 'phone', 'response', 'offer', 'toddler', 'fee', 'real', 'earth'];
  const getters = {
    'setup/getShuffledSeed': () => { return () => { return shuffledSeed; }; },
  };
  const delay = 501;

  let wrapper;
  let router;
  let store;
  let storeMocks;

  const defaultProps = {};

  function wrapperInit(options) {
    return mount(SeedConfirm, options);
  }

  function storeInit(custom, propsData, parentComponent = null) {
    storeMocks = createStoreMocks(custom);
    router = createRouter(storeMocks.store);
    router.push({ path: '/setup/3' });
    wrapper = wrapperInit({
      i18n,
      router,
      localVue,
      propsData,
      parentComponent,
      store: storeMocks.store,
    });
    store = wrapper.vm.$store;
  }

  beforeEach(() => { storeInit({ getters }, defaultProps); });


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

  it('goes to the next setup step if seed is entered in the correct order', (done) => {
    wrapper.vm.$nextTick(() => {
      const correctOrder = [10, 0, 2, 5, 6, 8, 9, 7, 4, 3, 1, 11];
      correctOrder.forEach((number) => {
        const button = wrapper.findAll('button').at(number);
        button.trigger('click');
      });
      setTimeout(() => {
        expect(store.state.route.path).toBe('/setup/4');
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
