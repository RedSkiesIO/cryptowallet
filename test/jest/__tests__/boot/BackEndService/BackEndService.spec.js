/* eslint-disable no-magic-numbers */
import BackEndService from '@/boot/BackEndService/';
import { shallowMount } from '@vue/test-utils';
import { localVue, i18n, createRouter } from '@/helpers/SetupLocalVue';
import { createMocks as createStoreMocks } from '@/store/__mocks__/store.js';
import Account from '@/store/wallet/entities/account';
import LatestPrice from '@/store/latestPrice';
import axios from 'axios';

jest.mock('axios');
const mockAxios = axios;

const accountData = JSON.parse('{"$id":1,"id":1,"uid":"b2d1d4a8-59ed-f8a1-6476-30255f71618e","refresh_token":"U2FsdGVkX1/J7bIecIeyIFBThzJ9IE8DnqJsf92AqgjcmsVeC23aE6hj9zB1U/7oAqcyoV7+chYPOSP8yWEuRE1xCMdaKsY4bMEwsWhFIGQ9VxlHF3a0TJ/OC4zszCONeJ7lV9NJeXZAkRmtLKJgCM4uSPjqlIPehigFVx8xjkDSXyIeODBWXQV/cREYMN/YtQVLFQtOGUGD0PfoVVNKscEG8mHKBlzroggJgWH+sjQjeFnFUsy48sy7Kc9DFs+8eUFvUpAqnXIXK6sIREv2/Q==","salt":"$2a$10$h7F3s0YLfsMzEKdmOIMMl.","pinHash":"$2a$10$h7F3s0YLfsMzEKdmOIMMl.QVtO2TKFA1Tj9H8Tsrz0AqH9Tr3cPBC","name":"asd","locale":"en-gb","currency":"","node":null,"default":true,"seed":["release","thunder","stuff","feature","grant","super","sing","exit","profit","document","busy","allow"],"wallets":[]}');
const priceFeedMockData = {
  data: JSON.parse('[{"code":"LTC","timestamp":1554822001,"USD":{"VOLUME24HOURTO":39452158.366346404,"PRICE":86.93,"CHANGEPCT24HOUR":-2.391646081293505},"GBP":{"VOLUME24HOURTO":300457.538486898,"PRICE":66.78,"CHANGEPCT24HOUR":-2.0246478873239373},"EUR":{"VOLUME24HOURTO":5453299.632552724,"PRICE":77.06,"CHANGEPCT24HOUR":-2.7143037495265645}},{"code":"DASH","timestamp":1554822001,"USD":{"VOLUME24HOURTO":1596366.3342347918,"PRICE":132.65,"CHANGEPCT24HOUR":-2.312394138007207},"GBP":{"VOLUME24HOURTO":0,"PRICE":101.109463,"CHANGEPCT24HOUR":-1.6226912928759842},"EUR":{"VOLUME24HOURTO":108050.5499353159,"PRICE":117.425379,"CHANGEPCT24HOUR":-1.6226912928759891}},{"code":"BTC","timestamp":1554822001,"USD":{"VOLUME24HOURTO":297775557.0302553,"PRICE":5211.81,"CHANGEPCT24HOUR":-0.6485151062844111},"GBP":{"VOLUME24HOURTO":6244012.486024588,"PRICE":3994.74,"CHANGEPCT24HOUR":-0.4190400219366679},"EUR":{"VOLUME24HOURTO":60390862.8537972,"PRICE":4623.64,"CHANGEPCT24HOUR":-0.8447297143702576}},{"code":"ETH","timestamp":1554822002,"USD":{"VOLUME24HOURTO":123274257.58677226,"PRICE":177.51,"CHANGEPCT24HOUR":-1.1031255223132308},"GBP":{"VOLUME24HOURTO":741737.3245507771,"PRICE":135.59,"CHANGEPCT24HOUR":-1.5323166303558355},"EUR":{"VOLUME24HOURTO":19935487.449444696,"PRICE":157.47,"CHANGEPCT24HOUR":-1.2355745107877565}},{"code":"CAT","timestamp":1554822001,"USD":{"VOLUME24HOURTO":0,"PRICE":0.09911949660000001,"CHANGEPCT24HOUR":0},"GBP":{"VOLUME24HOURTO":0,"PRICE":0.0759778626,"CHANGEPCT24HOUR":0},"EUR":{"VOLUME24HOURTO":0,"PRICE":0.08794163280000002,"CHANGEPCT24HOUR":0}}]'),
};

const pin = [0, 0, 0, 0, 0, 0];

describe('boot/BackEndService', () => {
  let errorHandler;
  let wrapperMock;
  let router;
  let store;
  let storeMocks;
  let backEndService;

  const defaultProps = {};

  function wrapperInit(options) {
    return shallowMount({ name: 'mock', template: '<div/>' }, options);
  }

  function storeInit(custom, propsData) {
    errorHandler = jest.fn();
    storeMocks = createStoreMocks(custom);
    Account.insert({ data: accountData });
    BackEndService({ Vue: localVue });

    router = createRouter(storeMocks.store);
    router.push({ path: '/setup/0' });
    wrapperMock = wrapperInit({
      i18n,
      router,
      localVue,
      propsData,
      store: storeMocks.store,
      mocks: {
        errorHandler,
      },
    });
    store = wrapperMock.vm.$store;

    backEndService = new wrapperMock.vm.$root.BackEndService(wrapperMock.vm, accountData.id, pin.join(''));
  }

  beforeEach(() => { storeInit({}, defaultProps); });

  it('exports a function', async () => {
    expect(typeof BackEndService).toBe('function');
  });

  it('sets refresh token correctly when initialised ', () => {
    expect(backEndService.refreshToken).toBe(accountData.refresh_token);
  });

  describe('connect() method', () => {
    it('uses a refresh token if available', async (done) => {
      backEndService.refreshAuth = jest.fn().mockReturnValue(201);
      const result = await backEndService.connect();
      expect(result).toBe(true);
      done();
    });

    it('tries to re-authenticate if refresh token invalid', async (done) => {
      backEndService.refreshAuth = jest.fn().mockImplementation(() => {
        throw new Error();
      });
      backEndService.auth = jest.fn().mockReturnValue(200);
      const result = await backEndService.connect();
      expect(backEndService.refreshAuth).toHaveBeenCalled();
      expect(backEndService.auth).toHaveBeenCalled();
      expect(result).toBe(true);
      done();
    });

    it('tries to re-authenticate if no refreshToken available', async (done) => {
      backEndService.auth = jest.fn().mockReturnValue(200);
      backEndService.refreshToken = null;
      const result = await backEndService.connect();
      expect(backEndService.auth).toHaveBeenCalled();
      expect(result).toBe(true);
      done();
    });

    it('tries to establish connection x number of times based on the config', async (done) => {
      backEndService.auth = jest.fn().mockImplementation(() => {
        throw new Error();
      });

      backEndService.refreshAuth = jest.fn().mockImplementation(() => {
        throw new Error();
      });

      const createMock = jest.fn();
      wrapperMock.vm.$toast.create = createMock;

      backEndService.refreshToken = null;
      backEndService.maxConnectAttempts = 3;
      backEndService.longDelay = 50;
      backEndService.connect();

      setTimeout(() => {
        expect(createMock).toHaveBeenCalledWith(10, wrapperMock.vm.$t('failedToConnect'), 500);
        expect(createMock).toHaveBeenCalledTimes(3);
        done();
      }, 500);
    });
  });

  describe('auth() method', () => {
    it('calls the auth endpoint and returns the status code, stores access and refresh tokens if applicable', async (done) => {
      const mockResponse = {
        status: 200,
        data: {
          accessToken: 'accessTokenString',
          refreshToken: 'refreshTokenString',
        },
      };
      mockAxios.get.mockResolvedValueOnce(mockResponse);
      process.env.BACKEND_SERVICE_URL = 'http://foo.bar';

      await backEndService.auth();

      setTimeout(() => {
        const calledWithURL = mockAxios.get.mock.calls[0][0];
        const re = new RegExp(`^${process.env.BACKEND_SERVICE_URL}/auth/token/`);
        expect(re.test(calledWithURL)).toBe(true);

        expect(backEndService.accessToken).toBe(mockResponse.data.accessToken);
        expect(backEndService.refreshToken).toBe(mockResponse.data.refreshToken);
        done();
      }, 50);
    });
  });

  describe('refreshAuth() method', () => {
    it('calls the refresh token endpoint with correct data and returns the status code, stores access and refresh tokens if applicable', async (done) => {
      const mockResponse = {
        status: 201,
        data: {
          accessToken: 'accessTokenRefresh',
          refreshToken: 'refreshTokenRefresh',
        },
      };
      mockAxios.post.mockResolvedValueOnce(mockResponse);
      process.env.BACKEND_SERVICE_URL = 'http://foo.bar';

      const currentRefreshToken = backEndService.refreshToken;
      await backEndService.refreshAuth();

      setTimeout(() => {
        const calledWithURL = mockAxios.post.mock.calls[0][0];
        const calledWithData = mockAxios.post.mock.calls[0][1];

        const re = new RegExp(`^${process.env.BACKEND_SERVICE_URL}/auth/refresh`);
        expect(re.test(calledWithURL)).toBe(true);

        expect(calledWithData.refresh_token).toBe(currentRefreshToken);

        expect(backEndService.accessToken).toBe(mockResponse.data.accessToken);
        expect(backEndService.refreshToken).toBe(mockResponse.data.refreshToken);
        done();
      }, 50);
    });
  });

  describe('try() method', () => {
    it('makes a call to the URL and returns the response, updates the refresh token', async (done) => {
      const mockResponse = {
        headers: {
          new_refresh_token: 'soFreshSuchToken',
        },
        status: 200,
      };

      mockAxios.get.mockClear();
      mockAxios.get.mockResolvedValueOnce(mockResponse);
      backEndService.accessToken = 'fakeAccessToken';

      const exampleURL = 'http://example.com';
      const response = await backEndService.try(exampleURL);

      setTimeout(() => {
        const calledWithURL = mockAxios.get.mock.calls[0][0];
        const calledWithData = mockAxios.get.mock.calls[0][1];

        const re = new RegExp(`^${exampleURL}`);
        expect(re.test(calledWithURL)).toBe(true);

        expect(calledWithData.headers.Authorization).toBe(`Bearer ${backEndService.accessToken}`);
        expect(response).toBe(mockResponse);
        expect(backEndService.refreshToken).toBe(mockResponse.headers.new_refresh_token);
        done();
      }, 50);
    });

    it('makes multiple attempts if the request fails', async (done) => {
      mockAxios.get = jest.fn().mockImplementation(() => {
        throw new Error();
      });

      backEndService.maxTryAttempts = 3;
      backEndService.longDelay = 50;

      const exampleURL = 'http://example.com';
      backEndService.try(exampleURL);

      setTimeout(() => {
        expect(mockAxios.get).toHaveBeenCalledTimes(3);
        done();
      }, 500);
    });

    it('performs authentication if access denied', async (done) => {
      mockAxios.get = jest.fn().mockImplementation(() => {
        const errorMock = new Error();
        errorMock.response = {
          status: 401,
        };

        throw errorMock;
      });

      backEndService.connect = jest.fn().mockImplementation(() => {
        return true;
      });

      backEndService.refreshToken = null;
      backEndService.maxTryAttempts = 3;
      backEndService.longDelay = 50;

      const exampleURL = 'http://example.com';
      backEndService.try(exampleURL);

      setTimeout(() => {
        expect(backEndService.connect).toHaveBeenCalled();
        done();
      }, 1500);
    });
  });

  describe('getPriceFeed() method', () => {
    it('uses ["ALL"] as a default currencies argument', () => {
      const coins = ['BTC', 'ETH'];
      process.env.BACKEND_SERVICE_URL = 'http://foo.bar';
      backEndService.try = jest.fn();

      backEndService.getPriceFeed(coins);
      const calledURL = backEndService.try.mock.calls[0][0];
      const re = new RegExp(`^${process.env.BACKEND_SERVICE_URL}/price-feed/${coins.join(',')}/ALL`);
      expect(re.test(calledURL)).toBe(true);
    });

    it('calls try() method with correct arguments and returns the result', async (done) => {
      const coins = ['BTC', 'ETH'];
      const currencies = ['USD', 'GBP'];
      const data = { status: 200 };
      process.env.BACKEND_SERVICE_URL = 'http://foo.bar';

      backEndService.try = jest.fn().mockImplementation(() => {
        return data;
      });

      const result = await backEndService.getPriceFeed(coins, currencies);

      const calledURL = backEndService.try.mock.calls[0][0];
      const re = new RegExp(`^${process.env.BACKEND_SERVICE_URL}/price-feed/${coins.join(',')}/${currencies.join(',')}`);
      expect(re.test(calledURL)).toBe(true);
      expect(result).toBe(data);
      done();
    });
  });

  describe('getHistoricalData() method', () => {
    it('calls try() method with correct arguments', () => {
      const coin = 'BTC';
      const currency = 'GBP';
      const period = 'month';

      process.env.BACKEND_SERVICE_URL = 'http://foo.bar';
      backEndService.try = jest.fn();
      backEndService.getHistoricalData(coin, currency, period);

      const calledURL = backEndService.try.mock.calls[0][0];
      const re = new RegExp(`^${process.env.BACKEND_SERVICE_URL}/price-history/${coin}/${currency}/${period}`);
      expect(re.test(calledURL)).toBe(true);
    });

    it('formats the historical data before returning it', async (done) => {
      const coin = 'BTC';
      const currency = 'GBP';
      const period = 'day';

      const msToS = 1000;
      const mockData = [{ time: 10, close: 10 }, { time: 20, close: 20 }];

      process.env.BACKEND_SERVICE_URL = 'http://foo.bar';
      backEndService.try = jest.fn().mockImplementation(() => {
        return {
          data: {
            data: mockData,
          },
        };
      });

      const result = await backEndService.getHistoricalData(coin, currency, period);

      const calledURL = backEndService.try.mock.calls[0][0];
      const re = new RegExp(`^${process.env.BACKEND_SERVICE_URL}/price-history/${coin}/${currency}/${period}`);
      expect(re.test(calledURL)).toBe(true);

      result.data.forEach((dataPoint, index) => {
        expect(dataPoint.t).toBe(mockData[index].time * msToS);
        expect(dataPoint.y).toBe(mockData[index].close);
      });

      done();
    });
  });

  describe('getTransactionFee() method', () => {
    it('calls try() method with correct arguments and returns data', async (done) => {
      const coin = 'BTC';
      const mockData = 'fake data';

      process.env.BACKEND_SERVICE_URL = 'http://foo.bar';
      backEndService.try = jest.fn().mockImplementation(() => {
        return mockData;
      });

      const result = await backEndService.getTransactionFee(coin);
      const calledURL = backEndService.try.mock.calls[0][0];
      const re = new RegExp(`^${process.env.BACKEND_SERVICE_URL}/fee-estimate/${coin}`);
      expect(re.test(calledURL)).toBe(true);
      expect(result).toBe(mockData);
      done();
    });
  });

  describe('storePriceData() method', () => {
    it('stores the price data if data does not exist', async (done) => {
      const coin = 'BTC';
      const mockPriceData = ['such', 'data', 'many', 'bytes'];
      await backEndService.storePriceData(coin, mockPriceData);

      expect(LatestPrice.all()[0].data).toBe(mockPriceData);
      done();
    });

    it('updates price data if data exist', async (done) => {
      const coin = 'BTC';
      const mockPriceData = ['such', 'data', 'many', 'bytes'];
      await backEndService.storePriceData(coin, mockPriceData);
      expect(LatestPrice.all()[0].data).toBe(mockPriceData);

      const dataTimestamp = LatestPrice.all()[0].updated;

      const mockPriceDataUpdated = ['such', 'data', 'very', 'updated'];
      await backEndService.storePriceData(coin, mockPriceDataUpdated);

      expect(LatestPrice.all().length).toBe(1);
      expect(LatestPrice.all()[0].data).toBe(mockPriceDataUpdated);
      expect(LatestPrice.all()[0].updated > dataTimestamp).toBe(true);

      done();
    });
  });

  describe('loadPriceFeed() method', () => {
    it('takes all of the supported coins and stores their price data', async (done) => {
      backEndService.getPriceFeed = jest.fn().mockImplementation(() => {
        return priceFeedMockData;
      });

      backEndService.storePriceData = jest.fn();
      await backEndService.loadPriceFeed();
      expect(backEndService.getPriceFeed).toHaveBeenCalled();

      const numOfCoins = store.state.settings.supportedCoins.length;
      expect(backEndService.storePriceData).toHaveBeenCalledTimes(numOfCoins);
      done();
    });

    it('creates a toast if encountered an error', async (done) => {
      backEndService.getPriceFeed = jest.fn().mockImplementation(() => {
        return priceFeedMockData;
      });

      LatestPrice.find = jest.fn().mockImplementation(() => {
        throw new Error('what happened');
      });

      wrapperMock.vm.$toast.create = jest.fn();
      await backEndService.loadPriceFeed();

      expect(wrapperMock.vm.$toast.create).toHaveBeenCalledWith(10, 'what happened', 500);
      done();
    });
  });
});
