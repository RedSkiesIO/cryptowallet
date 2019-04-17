import PriceCharts from '@/components/Modals/PriceCharts/PriceChartsContent.vue';
import { shallowMount } from '@vue/test-utils';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';
// import Prices from '@/store/prices';
// import Latest from '@/store/latestPrice';
// import Coin from '@/store/wallet/entities/coin';

describe('modals/PriceCharts', () => {
  let storeMocks;
  let wrapper;
  let router;

  function wrapperInit(options) {
    return shallowMount(PriceCharts, options);
  }

  function storeInit(custom) {
    storeMocks = createStoreMocks(custom);
    router = createRouter(storeMocks.store);
    router.push({ path: '/wallet/' });
    wrapper = wrapperInit({
      i18n,
      router,
      localVue,
      store: storeMocks.store,
    });
  }
  beforeEach(() => {
    jest.clearAllMocks();
    return storeInit();
  });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });
});
