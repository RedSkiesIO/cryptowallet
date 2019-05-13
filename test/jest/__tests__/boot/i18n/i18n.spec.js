import i18n from '@/boot/i18n';

jest.mock('vue-i18n');
const mockVue = {
  use: jest.fn(),
};

const mockApp = {
  i18n: jest.fn(),
};

describe('i18n.js', () => {
  it('exports a function', () => {
    expect(typeof i18n).toBe('function');
  });

  it('adds the plugin to the vue instance', () => {
    i18n({ app: mockApp, Vue: mockVue });
    expect(mockVue.use).toHaveBeenCalled();
  });
});
