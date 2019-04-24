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

  const chartData = JSON.parse('{"$id":"CAT_GBP_day","coin":"CAT","currency":"GBP","period":"day","updated":1556099369630,"data":[{"t":1556010000000,"y":135.02},{"t":1556013600000,"y":134.7},{"t":1556017200000,"y":134.33},{"t":1556020800000,"y":134.57},{"t":1556024400000,"y":135.14},{"t":1556028000000,"y":135.43},{"t":1556031600000,"y":134.65},{"t":1556035200000,"y":134.81},{"t":1556038800000,"y":134.8},{"t":1556042400000,"y":134.79},{"t":1556046000000,"y":134.12},{"t":1556049600000,"y":133.71},{"t":1556053200000,"y":134.17},{"t":1556056800000,"y":132.86},{"t":1556060400000,"y":132.23},{"t":1556064000000,"y":132.27},{"t":1556067600000,"y":131.07},{"t":1556071200000,"y":131.49},{"t":1556074800000,"y":131.61},{"t":1556078400000,"y":131.92},{"t":1556082000000,"y":131.59},{"t":1556085600000,"y":131.29},{"t":1556089200000,"y":128.03},{"t":1556092800000,"y":128.1},{"t":1556096400000,"y":128.02}]}');

  const errorHandler = jest.fn();

  const backEndService = {
    getHistoricalData: jest.fn(),
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
        code: 'CAT', timestamp: 1556100003, currency: 'GBP', period: 'day', data: [{ t: 1556013600000, y: 134.7 }, { t: 1556017200000, y: 134.33 }, { t: 1556020800000, y: 134.57 }, { t: 1556024400000, y: 135.14 }, { t: 1556028000000, y: 135.43 }, { t: 1556031600000, y: 134.65 }, { t: 1556035200000, y: 134.81 }, { t: 1556038800000, y: 134.8 }, { t: 1556042400000, y: 134.79 }, { t: 1556046000000, y: 134.12 }, { t: 1556049600000, y: 133.71 }, { t: 1556053200000, y: 134.17 }, { t: 1556056800000, y: 132.86 }, { t: 1556060400000, y: 132.23 }, { t: 1556064000000, y: 132.27 }, { t: 1556067600000, y: 131.07 }, { t: 1556071200000, y: 131.49 }, { t: 1556074800000, y: 131.61 }, { t: 1556078400000, y: 131.92 }, { t: 1556082000000, y: 131.59 }, { t: 1556085600000, y: 131.29 }, { t: 1556089200000, y: 128.03 }, { t: 1556092800000, y: 128.1 }, { t: 1556096400000, y: 127.61 }, { t: 1556100000000, y: 127.13 }],
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
    Prices.$insert({ data: chartData });
    setTimeout(() => {
      expect(Prices.all()[0].data[0].t).toEqual(1556013600000);
      expect(Prices.all()[0].data[0].y).toEqual(134.7);
      done();
    }, 0);
  });

  it('calls the api and inserts the chart data if does not exist', (done) => {
    backEndService.getHistoricalData.mockImplementationOnce(() => {});
    storeInit();
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

  it('the receive button routes to /wallet/send', (done) => {
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
