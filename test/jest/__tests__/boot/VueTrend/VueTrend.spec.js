import VueTrend from '@/boot/VueTrend';

jest.mock('vuetrend');
const mockVue = {
  use: jest.fn(),
};
describe('vueTrend.js', () => {
  it('exports a function', () => {
    expect(typeof VueTrend).toBe('function');
  });

  it('adds the plugin to the vue instance', () => {
    VueTrend({ Vue: mockVue });
    expect(mockVue.use).toHaveBeenCalled();
  });
});
