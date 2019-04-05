import WalletDiscovery from '@/boot/WalletDiscovery/';
import { shallowMount } from '@vue/test-utils';
import { localVue, i18n } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';

const { store } = createStoreMocks();
let wrapperMock;
let discoveryInstance;
const wallet = {};
const coinSDK = {
  accountDiscovery: jest.fn(),
  getTransactionHistory: jest.fn(),
  getBalance: jest.fn(),
};
const network = 'BITCOIN';

describe('boot/WalletDiscovery', () => {
  beforeEach(() => {
    wrapperMock = shallowMount({ name: 'mock', template: '<div/>' }, { i18n, localVue, store });
  });

  it('exports a function', (done) => {
    wrapperMock.vm.$nextTick(() => {
      // eslint-disable-next-line new-cap
      discoveryInstance = new wrapperMock.vm.discoverWallet(wallet, coinSDK, network, 'Ethereum');
      console.log(discoveryInstance);
      expect(typeof WalletDiscovery).toBe('function');
      done();
    });
  });
});
