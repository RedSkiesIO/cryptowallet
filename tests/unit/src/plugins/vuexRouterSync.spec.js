jest.mock('vuex-router-sync');
import vuexRouterSync from '@/plugins/vuexRouterSync';

describe('vuexRouterSync.js', () => {

  it('exports a function', () => {
    expect(typeof vuexRouterSync).toBe('function');
  });

  it('exported function calls sync with { store, router } arguments', () => {
    const sync = vuexRouterSync({ store: 'I am a store', router: 'I am a router' });
    expect(sync).toHaveBeenCalledWith('I am a store', 'I am a router');
  });
});
