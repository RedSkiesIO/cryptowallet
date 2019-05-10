/* eslint-disable no-magic-numbers */
import { createLocalVue } from '@vue/test-utils';
import Store from '@/store';
import Vuex from 'vuex';


describe('store', () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  const store = Store;

  it('creates the vuex store', () => {
    expect(store).toBeDefined();
  });

  it('sets the loading state to false after loki is added to vuex', (done) => {
    store.dispatch('settings/setLoading', true);
    setTimeout(() => {
      expect(store.state.settings.loading).toBe(false);
      done();
    }, 1500);
  });
});
