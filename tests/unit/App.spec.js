import { shallowMount, localVue } from '@vue/test-utils';
import App from '@/App.vue';
import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

describe('App.vue', () => {
  let wrapper;

  const stubs = {
    QApp: '<div id="q-app"><transition name="fade" mode="out-in"><router-view></router-view></transition></div>',
  };

  function wrapperInit(options) {
    return shallowMount(App, options);
  }

  beforeEach(() => {
    wrapper = wrapperInit({ localVue, stubs });
  });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('expect q-app', () => {
    expect(wrapper.contains('div#q-app')).toBe(true);
  });
});
