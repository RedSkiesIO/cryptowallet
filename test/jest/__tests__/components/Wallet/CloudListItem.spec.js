/* eslint-disable no-magic-numbers */
import CloudListItem from '@/components/Wallet/CloudListItem';
import { mount } from '@vue/test-utils';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';
import Wallet from '@/store/wallet/entities/wallet';
import Prices from '@/store/prices';

describe('CloudListItem.vue', () => {
  let storeMocks;
  let wrapper;
  let router;

  const chartData = JSON.parse('{"$id":"CAT_GBP_day","coin":"CAT","currency":"GBP","period":"day","updated":15580,"data":[{"t":15560100,"y":135.02},{"t":15560136,"y":134.7},{"t":15560172,"y":134.33},{"t":15560208,"y":134.57},{"t":15560244,"y":135.14},{"t":15560280,"y":135.43},{"t":15560316,"y":134.65},{"t":15560352,"y":134.81},{"t":15560388,"y":134.8},{"t":15560424,"y":134.79},{"t":15560460,"y":134.12},{"t":15560496,"y":133.71},{"t":15560532,"y":134.17},{"t":15560568,"y":132.86},{"t":15560604,"y":132.23},{"t":15560640,"y":132.27},{"t":15560676,"y":131.07},{"t":15560712,"y":131.49},{"t":15560748,"y":131.61},{"t":15560784,"y":131.92},{"t":15560820,"y":131.59},{"t":15560856,"y":131.29},{"t":15560892,"y":128.03},{"t":15560928,"y":128.1},{"t":15560964,"y":128.02}]}');

  const errorHandler = jest.fn();

  const backEndService = {
    getHistoricalData: jest.fn(),
    storeChartData: jest.fn(),
  };

  const propsData = {
    wallet: {
      id: 1,
      name: 'Catalyst',
      displayName: 'Catalyst',
      parentName: 'Ethereum',
      symbol: 'CAT',
      network: 'ETHEREUM_ROPSTEN',
      sdk: 'ERC20',
      confirmedBalance: 20,
    },
  };

  function wrapperInit(options) {
    return mount(CloudListItem, options);
  }

  function storeInit(custom) {
    storeMocks = createStoreMocks(custom);
    Prices.$insert({ data: chartData });
    Wallet.$insert({
      data: [{
        id: 1,
        account_id: 1,
        name: 'Catalyst',
        displayName: 'Catalyst',
        parentName: 'Ethereum',
        symbol: 'CAT',
        network: 'ETHEREUM_ROPSTEN',
        sdk: 'ERC20',
        confirmedBalance: 20,
        enabled: true,
        imported: true,
      },
      {
        id: 2,
        account_id: 1,
        name: 'Ethereum',
        displayName: 'Ethereum',
        symbol: 'ETH',
        network: 'ETHEREUM_ROPSTEN',
        sdk: 'ERC20',
        confirmedBalance: 20,
        enabled: true,
        imported: true,
      }],
    });
    router = createRouter(storeMocks.store);
    router.push({ path: '/wallet' });
    wrapper = wrapperInit({
      i18n,
      router,
      localVue,
      store: storeMocks.store,
      propsData,
      mocks: { errorHandler, backEndService },
      stubs: { CoinHeader: true, trend: true },
    });
  }

  it('renders and matches snapshot', () => {
    storeInit();
    expect(wrapper.element).toMatchSnapshot();
  });

  it('displays the price chart button if data is available', (done) => {
    backEndService.getHistoricalData.mockImplementation(() => {
      return {
        code: 'CAT', timestamp: 1556100003, currency: 'GBP', period: 'day', data: [{ t: 15560136, y: 134.7 }, { t: 15560172, y: 134.33 }, { t: 15560208, y: 134.57 }, { t: 15560244, y: 135.14 }, { t: 15560280, y: 135.43 }, { t: 15560316, y: 134.65 }, { t: 15560352, y: 134.81 }, { t: 15560388, y: 134.8 }, { t: 15560424, y: 134.79 }, { t: 1556046, y: 134.12 }, { t: 15560496, y: 133.71 }, { t: 15560532, y: 134.17 }, { t: 15560568, y: 132.86 }, { t: 15560604, y: 132.23 }, { t: 15560640, y: 132.27 }, { t: 15560676, y: 131.07 }, { t: 15560712, y: 131.49 }, { t: 15560748, y: 131.61 }, { t: 15560784, y: 131.92 }, { t: 15560820, y: 131.59 }, { t: 15560856, y: 131.29 }, { t: 15560892, y: 128.03 }, { t: 15560928, y: 128.1 }, { t: 15560964, y: 127.61 }, { t: 15561000, y: 127.13 }],
      };
    });
    storeInit();
    Prices.$insert({ data: chartData });
    setTimeout(() => {
      expect(wrapper.findAll('button').at(2).text()).toBe('timeline');
      done();
    }, 0);
  });

  it('calls the api for chart data and updates the database', (done) => {
    storeInit();
    setTimeout(() => {
      expect(backEndService.storeChartData).toHaveBeenCalled();
      done();
    }, 501);
  });

  it('hides the chart if no price data exists', (done) => {
    backEndService.getHistoricalData.mockImplementationOnce(() => {});
    storeInit();
    Prices.$delete('CAT_GBP_day');
    setTimeout(() => {
      expect(wrapper.vm.showChart).toEqual(false);
      done();
    }, 0);
  });

  it('does not display a price chart if no data exists and it cannot be fetched', (done) => {
    storeInit();
    setTimeout(() => {
      expect(Prices.all().length).toEqual(1);
      done();
    }, 0);
  });

  it('handles any errors', (done) => {
    backEndService.getHistoricalData.mockImplementationOnce(() => { throw new Error('Test Error'); });
    storeInit();
    setTimeout(() => {
      expect(errorHandler).toHaveBeenCalledWith(Error('Test Error'));
      done();
    }, 0);
  });

  it('does not fetch new data if data is less than an hour old', (done) => {
    chartData.updated = Date.now();
    storeInit();
    setTimeout(() => {
      expect(wrapper.vm.chartData[0]).toEqual(135.02);
      done();
    }, 0);
  });


  it('the send button routes to /wallet/send', (done) => {
    storeInit();
    wrapper.findAll('button').at(0).trigger('click');
    setTimeout(() => {
      expect(router.history.current.path).toBe('/wallet/send/1');
      done();
    }, 0);
  });

  it('the receive button routes to /wallet/receive', (done) => {
    storeInit();
    wrapper.findAll('button').at(1).trigger('click');
    setTimeout(() => {
      expect(router.history.current.path).toBe('/wallet/receive/1');
      done();
    }, 0);
  });

  it('the chart button routes to /wallet/prices', (done) => {
    storeInit();
    Prices.$insert({ data: chartData });
    wrapper.findAll('button').at(2).trigger('click');
    setTimeout(() => {
      expect(router.history.current.path).toBe('/wallet/prices/1');
      done();
    }, 0);
  });

  it('the cloud item routes to /wallet/single', (done) => {
    storeInit();
    wrapper.find('.wallet-cloud').trigger('click');
    setTimeout(() => {
      expect(router.history.current.path).toBe('/wallet/single/1');
      done();
    }, 0);
  });
});
