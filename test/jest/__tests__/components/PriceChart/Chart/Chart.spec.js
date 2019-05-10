/* eslint-disable no-magic-numbers */
import Chart from '@/components/PriceCharts/Chart';
import { shallowMount } from '@vue/test-utils';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';

describe('components/Chart', () => {
  let storeMocks;
  let wrapper;
  let router;


  const mockChartData = {
    datasets: [{ backgroundColor: null }],
  };

  function wrapperInit(options) {
    return shallowMount(Chart, options);
  }

  function storeInit(custom) {
    storeMocks = createStoreMocks(custom);
    router = createRouter(storeMocks.store);
    router.push({ path: '/wallet/single/prices/5' });
    wrapper = wrapperInit({
      i18n,
      router,
      localVue,
      propsData: { chartData: mockChartData },
      store: storeMocks.store,
      stubs: { Line: true, mixins: true },
    });
  }
  beforeEach(() => {
    HTMLCanvasElement.prototype.getContext = () => {
      return {
        createLinearGradient: () => {
          return {
            addColorStop: jest.fn(),
          };
        },
      };
    };
    jest.clearAllMocks();
    return storeInit();
  });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('loads new chart when chartData changes', (done) => {
    const newChartData = {
      datasets: [{ backgroundColor: '#000000' }, { backgroundColor: '#000000' }],
    };
    wrapper.vm.chartData = newChartData;
    setTimeout(() => {
      done();
    }, 500);
  });
});
