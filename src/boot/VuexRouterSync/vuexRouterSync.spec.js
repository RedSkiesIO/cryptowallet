import vuexRouterSync from '@/boot/VuexRouterSync';

describe('vuexRouterSync.js', () => {
  it('exports a function', () => {
    expect(typeof vuexRouterSync).toBe('function');
  });
});
