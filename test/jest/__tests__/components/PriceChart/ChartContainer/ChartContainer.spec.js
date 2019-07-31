/* eslint-disable no-magic-numbers */
import ChartContainer from '@/components/PriceCharts/ChartContainer';
import { mount } from '@vue/test-utils';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';

import Wallet from '@/store/wallet/entities/wallet';
import Prices from '@/store/prices';
import Coin from '@/store/wallet/entities/coin';

const bitcoinWalletData = JSON.parse('{"$id":5,"id":5,"account_id":1,"name":"Bitcoin","displayName":"Bitcoin","symbol":"BTC","sdk":"Bitcoin","network":"BITCOIN_TESTNET","internalChainAddressIndex":0,"externalChainAddressIndex":1,"externalAddress":null,"confirmedBalance":0,"unconfirmedBalance":0,"imported":true,"enabled":true,"lastBlockHeight":0,"parentName":"","parentSdk":"","contractAddress":"","decimals":"","hdWallet":{"bip":49,"ext":{"xpriv":"xprv9zZZrtcYB6bg2sxhoVYYKAM8duZHP1MwV1SYNVLStU6qpY6NCKfuTCeeHe1MsBeYDt7XipqZYtshoGC9ghNZ6EVwugKxUPM7m2tFmExu2mt","xpub":"xpub6DYvGQ9S1U9yFN3AuX5YgJHsBwPmnU5nrEN9Ask4SodphLRWjrz9zzy88v6HFPGJuDoMg7hhEG2yFFhU7Djqx3AoE57hEL748iFp26JLXtC"},"int":{"xpriv":"xprv9zZZrtcYB6bg6LXLr8kweVuqCWUTc5dnFDJ526bEyz5pLHdfHRx2D1UPLE8bZy6hK8f1YpXQHeGF2FWEds5S1MSbTH2boaQRNUoz6vy4MRq","xpub":"xpub6DYvGQ9S1U9yJpboxAHx1drZkYJx1YMdcSDfpUzrYKcoD5xopyGGkonsBXbmCnHteYYMcjgWRU7EyByaGf8Mav4y5BTkYmC2TD2JVPmkJxs"},"type":1,"network":{"name":"BITCOIN_TESTNET","type":"testnet","bip":1,"segwit":true,"discovery":"http://92.207.178.198:3001/api","broadcastUrl":"https://chain.so/api/v2/send_tx/BTCTEST","feeApi":"https://api.blockcypher.com/v1/btc/main","connect":{"messagePrefix":"Bitcoin Signed Message:","bech32":"tb","bip32":{"public":70617039,"private":70615956},"pubKeyHash":111,"scriptHash":196,"wif":239}}},"erc20Wallet":""}');
const bitcoinData = JSON.parse('{"$id":"Bitcoin","name":"Bitcoin","displayName":"Bitcoin","minConfirmations":6,"sdk":"Bitcoin","symbol":"BTC","network":"BITCOIN_TESTNET","denomination":"0.00000000","parentName":"","parentSdk":"","contractAddress":"","decimals":""}');
const chartDataDay = JSON.parse('{"$id":"BTC_GBP_day","coin":"BTC","currency":"GBP","period":"day","updated":1555516399799,"data":[{"t":1555426800000,"y":3907.54},{"t":1555430400000,"y":3907.63},{"t":1555434000000,"y":3987.8},{"t":1555437600000,"y":3981.87},{"t":1555441200000,"y":3990.52},{"t":1555444800000,"y":3978.55},{"t":1555448400000,"y":3985.98},{"t":1555452000000,"y":3997},{"t":1555455600000,"y":3992.39},{"t":1555459200000,"y":4023.61},{"t":1555462800000,"y":4010.39},{"t":1555466400000,"y":4004.59},{"t":1555470000000,"y":4007.47},{"t":1555473600000,"y":4010.36},{"t":1555477200000,"y":4000.12},{"t":1555480800000,"y":3994.68},{"t":1555484400000,"y":4000.15},{"t":1555488000000,"y":4001.41},{"t":1555491600000,"y":3993.82},{"t":1555495200000,"y":4017.2},{"t":1555498800000,"y":4028.62},{"t":1555502400000,"y":3996.31},{"t":1555506000000,"y":3997.83},{"t":1555509600000,"y":4004.72},{"t":1555513200000,"y":3998.87}]}');
const chartDataWeek = JSON.parse('{"$id":"BTC_GBP_week","coin":"BTC","currency":"GBP","period":"week","updated":1555516399800,"data":[{"t":1554908400000,"y":4033.13},{"t":1554912000000,"y":4028.07},{"t":1554915600000,"y":4048.69},{"t":1554919200000,"y":4144.66},{"t":1554922800000,"y":4114.58},{"t":1554926400000,"y":4061.61},{"t":1554930000000,"y":4060},{"t":1554933600000,"y":4048.93},{"t":1554937200000,"y":4071.02},{"t":1554940800000,"y":4056.75},{"t":1554944400000,"y":4052.23},{"t":1554948000000,"y":4050.25},{"t":1554951600000,"y":3971.01},{"t":1554955200000,"y":3984.56},{"t":1554958800000,"y":3990.75},{"t":1554962400000,"y":3992.36},{"t":1554966000000,"y":3979.87},{"t":1554969600000,"y":3983.12},{"t":1554973200000,"y":3912.31},{"t":1554976800000,"y":3880.79},{"t":1554980400000,"y":3885.26},{"t":1554984000000,"y":3883.42},{"t":1554987600000,"y":3873.52},{"t":1554991200000,"y":3868.3},{"t":1554994800000,"y":3873.78},{"t":1554998400000,"y":3873.48},{"t":1555002000000,"y":3875.95},{"t":1555005600000,"y":3903.9},{"t":1555009200000,"y":3892.73},{"t":1555012800000,"y":3876.06},{"t":1555016400000,"y":3861.58},{"t":1555020000000,"y":3881.68},{"t":1555023600000,"y":3876.32},{"t":1555027200000,"y":3864.79},{"t":1555030800000,"y":3819.55},{"t":1555034400000,"y":3839.41},{"t":1555038000000,"y":3849.68},{"t":1555041600000,"y":3845.91},{"t":1555045200000,"y":3845.45},{"t":1555048800000,"y":3856.86},{"t":1555052400000,"y":3856.34},{"t":1555056000000,"y":3853.31},{"t":1555059600000,"y":3860.26},{"t":1555063200000,"y":3895.86},{"t":1555066800000,"y":3881.11},{"t":1555070400000,"y":3886.38},{"t":1555074000000,"y":3871.65},{"t":1555077600000,"y":3884.84},{"t":1555081200000,"y":3881.01},{"t":1555084800000,"y":3894.17},{"t":1555088400000,"y":3892.76},{"t":1555092000000,"y":3887.62},{"t":1555095600000,"y":3880.11},{"t":1555099200000,"y":3875.94},{"t":1555102800000,"y":3884.32},{"t":1555106400000,"y":3894.22},{"t":1555110000000,"y":3891.61},{"t":1555113600000,"y":3884.92},{"t":1555117200000,"y":3874.34},{"t":1555120800000,"y":3903.48},{"t":1555124400000,"y":3919.73},{"t":1555128000000,"y":3922.75},{"t":1555131600000,"y":3920.06},{"t":1555135200000,"y":3914.46},{"t":1555138800000,"y":3902.48},{"t":1555142400000,"y":3891.67},{"t":1555146000000,"y":3888.71},{"t":1555149600000,"y":3873.67},{"t":1555153200000,"y":3884.35},{"t":1555156800000,"y":3898.09},{"t":1555160400000,"y":3893.36},{"t":1555164000000,"y":3915.08},{"t":1555167600000,"y":3904.48},{"t":1555171200000,"y":3897.62},{"t":1555174800000,"y":3913.85},{"t":1555178400000,"y":3909.69},{"t":1555182000000,"y":3899.17},{"t":1555185600000,"y":3905.56},{"t":1555189200000,"y":3898.75},{"t":1555192800000,"y":3893.58},{"t":1555196400000,"y":3895.23},{"t":1555200000000,"y":3890.86},{"t":1555203600000,"y":3891.6},{"t":1555207200000,"y":3887.94},{"t":1555210800000,"y":3885.81},{"t":1555214400000,"y":3882.76},{"t":1555218000000,"y":3865.61},{"t":1555221600000,"y":3869.94},{"t":1555225200000,"y":3893.21},{"t":1555228800000,"y":3895.73},{"t":1555232400000,"y":3899.46},{"t":1555236000000,"y":3887.73},{"t":1555239600000,"y":3896.83},{"t":1555243200000,"y":3896.18},{"t":1555246800000,"y":3896.74},{"t":1555250400000,"y":3901.94},{"t":1555254000000,"y":3902.81},{"t":1555257600000,"y":3907.69},{"t":1555261200000,"y":3909.22},{"t":1555264800000,"y":3906.1},{"t":1555268400000,"y":3908.29},{"t":1555272000000,"y":3910.29},{"t":1555275600000,"y":3917.14},{"t":1555279200000,"y":3949.01},{"t":1555282800000,"y":3949.76},{"t":1555286400000,"y":3952.87},{"t":1555290000000,"y":3955.66},{"t":1555293600000,"y":3957.5},{"t":1555297200000,"y":3943.74},{"t":1555300800000,"y":3962.51},{"t":1555304400000,"y":3963.71},{"t":1555308000000,"y":3954.8},{"t":1555311600000,"y":3945.37},{"t":1555315200000,"y":3941.02},{"t":1555318800000,"y":3935.87},{"t":1555322400000,"y":3934.41},{"t":1555326000000,"y":3926.78},{"t":1555329600000,"y":3935.06},{"t":1555333200000,"y":3929.9},{"t":1555336800000,"y":3929.48},{"t":1555340400000,"y":3938.79},{"t":1555344000000,"y":3918.15},{"t":1555347600000,"y":3881.85},{"t":1555351200000,"y":3868.6},{"t":1555354800000,"y":3862.25},{"t":1555358400000,"y":3846},{"t":1555362000000,"y":3861.69},{"t":1555365600000,"y":3861.44},{"t":1555369200000,"y":3855.48},{"t":1555372800000,"y":3868.28},{"t":1555376400000,"y":3871.25},{"t":1555380000000,"y":3857.04},{"t":1555383600000,"y":3864.16},{"t":1555387200000,"y":3876.04},{"t":1555390800000,"y":3887.71},{"t":1555394400000,"y":3879.18},{"t":1555398000000,"y":3893.2},{"t":1555401600000,"y":3888.82},{"t":1555405200000,"y":3891.73},{"t":1555408800000,"y":3877.79},{"t":1555412400000,"y":3882.53},{"t":1555416000000,"y":3864.49},{"t":1555419600000,"y":3895.67},{"t":1555423200000,"y":3886.25},{"t":1555426800000,"y":3907.54},{"t":1555430400000,"y":3907.63},{"t":1555434000000,"y":3987.8},{"t":1555437600000,"y":3981.87},{"t":1555441200000,"y":3990.52},{"t":1555444800000,"y":3978.55},{"t":1555448400000,"y":3985.98},{"t":1555452000000,"y":3997},{"t":1555455600000,"y":3992.39},{"t":1555459200000,"y":4023.61},{"t":1555462800000,"y":4010.39},{"t":1555466400000,"y":4004.59},{"t":1555470000000,"y":4007.47},{"t":1555473600000,"y":4010.36},{"t":1555477200000,"y":4000.12},{"t":1555480800000,"y":3994.68},{"t":1555484400000,"y":4000.15},{"t":1555488000000,"y":4001.41},{"t":1555491600000,"y":3993.82},{"t":1555495200000,"y":4017.2},{"t":1555498800000,"y":4028.62},{"t":1555502400000,"y":3996.31},{"t":1555506000000,"y":3997.83},{"t":1555509600000,"y":4004.72},{"t":1555513200000,"y":3998.87}]}');
const chartDataMonth = JSON.parse('{"$id":"BTC_GBP_month","coin":"BTC","currency":"GBP","period":"month","updated":1555516399801,"data":[{"t":1552780800000,"y":2995.29},{"t":1552867200000,"y":3008.11},{"t":1552953600000,"y":3023.25},{"t":1553040000000,"y":3067.08},{"t":1553126400000,"y":3048.32},{"t":1553212800000,"y":3031.65},{"t":1553299200000,"y":3033.26},{"t":1553385600000,"y":3012.14},{"t":1553472000000,"y":2981.16},{"t":1553558400000,"y":2975.35},{"t":1553644800000,"y":3060.8},{"t":1553731200000,"y":3078.33},{"t":1553817600000,"y":3150.97},{"t":1553904000000,"y":3162.44},{"t":1553990400000,"y":3148.41},{"t":1554076800000,"y":3179.54},{"t":1554163200000,"y":3727.96},{"t":1554249600000,"y":3796.51},{"t":1554336000000,"y":3759.98},{"t":1554422400000,"y":3864.58},{"t":1554508800000,"y":3892.08},{"t":1554595200000,"y":3977.44},{"t":1554681600000,"y":4063.33},{"t":1554768000000,"y":3976.55},{"t":1554854400000,"y":4071.02},{"t":1554940800000,"y":3876.32},{"t":1555027200000,"y":3891.61},{"t":1555113600000,"y":3895.23},{"t":1555200000000,"y":3949.76},{"t":1555286400000,"y":3855.48},{"t":1555372800000,"y":3992.39},{"t":1555459200000,"y":3999.51}]}');

describe('components/ChartContainer', () => {
  let storeMocks;
  let wrapper;
  let router;

  const mockDatasets = [{ hidden: false }, { hidden: false }, { hidden: false }];

  const mockChart = {
    getDatasetMeta: jest.fn().mockImplementation((i) => {
      return mockDatasets[i];
    }),
    update: jest.fn(),
  };

  function wrapperInit(options) {
    return mount(ChartContainer, options);
  }

  function storeInit(custom) {
    storeMocks = createStoreMocks(custom);
    Wallet.insert({ data: [bitcoinWalletData] });
    Coin.insert({ data: [bitcoinData] });
    Prices.insert({ data: [chartDataDay, chartDataWeek, chartDataMonth] });

    router = createRouter(storeMocks.store);
    router.push({ path: '/wallet/single/prices/5' });
    wrapper = wrapperInit({
      i18n,
      router,
      localVue,
      store: storeMocks.store,
      stubs: { Chart: true },
      propsData: { datasets: [chartDataDay, chartDataWeek, chartDataMonth] },
    });
  }
  beforeEach(() => {
    jest.clearAllMocks();
    return storeInit();
  });

  it('renders and matches snapshot', () => {
    expect(wrapper.element).toMatchSnapshot();
  });

  it('renders three time period buttons', () => {
    expect(wrapper.findAll('.chart-button').length).toEqual(3);
  });

  it('changes the chart data when a time period button is clicked', () => {
    wrapper.vm.updateLegend(mockChart);
    wrapper.findAll('.chart-button').at(1).trigger('click');
    expect(mockChart.getDatasetMeta).toHaveBeenCalledTimes(3);
    expect(mockDatasets[0].hidden).toBe(true);
    expect(mockDatasets[2].hidden).toBe(true);
    expect(mockDatasets[1].hidden).toBe(false);

    wrapper.findAll('.chart-button').at(2).trigger('click');
    expect(mockDatasets[0].hidden).toBe(true);
    expect(mockDatasets[2].hidden).toBe(false);
    expect(mockDatasets[1].hidden).toBe(true);

    wrapper.findAll('.chart-button').at(0).trigger('click');
    expect(mockDatasets[0].hidden).toBe(false);
    expect(mockDatasets[2].hidden).toBe(true);
    expect(mockDatasets[1].hidden).toBe(true);
  });

  it('displays the slected currency symbol on the chart y axis', () => {
    const yAxisValue = wrapper.vm.options.scales.yAxes[0].ticks.callback(5);
    expect(yAxisValue).toEqual('£5');
  });
});
