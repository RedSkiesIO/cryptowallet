import vuexRouterSync from '@/boot/VuexRouterSync';
import { sync } from 'vuex-router-sync';

jest.mock('vuex-router-sync');

describe('vuexRouterSync.js', () => {
  it('exports a function', () => {
    expect(typeof vuexRouterSync).toBe('function');
  });

  it('runs the sync function', () => {
    vuexRouterSync({ store: {}, router: {} });
    expect(sync).toHaveBeenCalled();
  });
});
