import axios from 'axios';
import Account from '@/store/wallet/entities/account';
import Prices from '@/store/prices';
import LatestPrice from '@/store/latestPrice';

class BackEndService {
  vm = null;

  accessToken = null;

  refreshToken = null;

  accountId = null;

  account = null;

  password = null;

  delay = null;

  longDelay = null;

  maxConnectAttempts = null;

  maxTryAttempts = null;

  createdCode = null;

  successCode = null;

  constructor(vm, authenticatedAccount, password) {
    this.vm = vm;
    this.accountId = authenticatedAccount;
    this.account = this.vm.$store.getters['entities/account/find'](this.accountId);
    this.password = password;
    this.setRefreshToken(this.account.refresh_token);
    this.delay = 500;
    this.longDelay = 2500;
    this.maxConnectAttempts = 25;
    this.maxTryAttempts = 3;
    this.createdCode = 201;
    this.successCode = 200;
  }

  /**
   * Used to set value of the new refresh token
   * Also encrypts and puts the token in the persistent database
   * @param {String} token
   */
  setRefreshToken(token) {
    Account.$update({
      where: (record) => {
        return record.id === this.accountId;
      },
      data: { refresh_token: token },
      password: this.password,
    });

    this.refreshToken = token;
  }

  /**
   * Recursivly authenticates against the backend service
   * @param  {Number} attempts
   * @return {Promise}
   */
  connect(attempts = 0) {
    return new Promise(async (resolve) => {
      const attemptLimit = this.maxConnectAttempts;
      if (attempts >= attemptLimit) {
        this.vm.errorHandler(new Error(this.vm.$t('failedToConnect')), false);
        return false;
      }

      try {
        if (this.refreshToken) {
          try {
            // access denied, refresh access token
            const code = await this.refreshAuth();
            if (code === this.createdCode) {
              return resolve(true);
            }
          } catch (error) {
            // refresh token failed, re-authenticate
            const code = await this.auth();
            if (code === this.successCode) {
              return resolve(true);
            }
          }
        } else {
          const code = await this.auth();
          if (code === this.successCode) {
            return resolve(true);
          }
        }
      } catch (err) {
        this.vm.errorHandler(err);
      }

      setTimeout(() => {
        this.vm.$toast.create(10, this.vm.$t('failedToConnect'), this.delay);
        resolve(this.connect(attempts += 1));
      }, this.longDelay);

      return false;
    });
  }

  /**
   * Calls the auth endpoint
   * @return {String}
   */
  async auth() {
    const response = await axios.get(`${process.env.BACKEND_SERVICE_URL}/auth/token/${Math.random().toString()}`);

    if (response.data) {
      this.accessToken = response.data.accessToken;
      this.setRefreshToken(response.data.refreshToken);
    }

    return response.status;
  }

  /**
   * Calls the refresh auth endpoint with the refresh token
   * @return {String}
   */
  async refreshAuth() {
    const data = { refresh_token: this.refreshToken };
    const response = await axios.post(`${process.env.BACKEND_SERVICE_URL}/auth/refresh`, data);

    if (response.data) {
      this.accessToken = response.data.accessToken;
      this.setRefreshToken(response.data.refreshToken);
    }

    return response.status;
  }

  /**
   * Sets up authorization headers for axios requests
   * @return {Object}
   */
  async getAxiosConfig() {
    return {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    };
  }

  /**
   * Used to make calls to the API
   * @param  {String} URL
   * @param  {Number} attempts
   * @return {Object}
   */
  try(URL, attempts = 0) {
    return new Promise(async (resolve) => {
      const attemptLimit = this.maxTryAttempts;
      if (attempts >= attemptLimit) {
        this.vm.errorHandler(new Error(this.vm.$t('failedToConnect')), false);
        return false;
      }

      try {
        const config = await this.getAxiosConfig();
        const response = await axios.get(URL, config);
        this.setRefreshToken(response.headers.new_refresh_token);
        return resolve(response);
      } catch (err) {
        if (err.response && err.response.status) {
          const unauthorized = 401;
          if (err.response.status === unauthorized) {
            await this.connect();
          }
          const notFound = 422;
          const internalError = 500;
          if (err.response.status === notFound || err.response.status === internalError) {
            return resolve(false);
          }
        }
      }

      setTimeout(() => {
        resolve(this.try(URL, attempts += 1));
      }, this.longDelay);

      return false;
    });
  }

  /**
   * Used to call the price-feed endpoint
   * @param  {Array}  coins
   * @param  {Array}  currencies
   * @return {Object}
   */
  async getPriceFeed(coins, currencies = ['ALL']) {
    const result = await this.try(`${process.env.BACKEND_SERVICE_URL}/price-feed/${coins.join(',')}/${currencies.join(',')}`);
    return result;
  }

  /**
   * Used to call the price-history endpoint
   * @param  {Array}  coin
   * @param  {Array}  currency
   * @param  {String} period
   * @return {Object}
   */
  async getHistoricalData(coin, currency, period) {
    const result = await this.try(`${process.env.BACKEND_SERVICE_URL}/price-history/${coin}/${currency}/${period}`);
    const msToS = 1000;
    if (!result) { return false; }

    result.data.data = result.data.data.map((x) => {
      return { t: x.time * msToS, y: x.close };
    });

    return result.data;
  }

  /**
   * Used to call the fee-estimate endpoint
   * @param  {String} coin
   * @return {Object}
   */
  async getTransactionFee(coin) {
    const result = await this.try(`${process.env.BACKEND_SERVICE_URL}/fee-estimate/${coin}`);
    return result;
  }

  /**
   * Puts the price data in the database
   * @param  {String} coin
   * @param  {Object} priceData
   * @return {Promise}
   */
  async storePriceData(coin, priceData) {
    const { selectedCurrency } = this.vm.$store.state.settings;

    return new Promise(async (resolve, reject) => {
      try {
        const checkPriceExists = (symbol, data) => {
          const price = LatestPrice.find([`${symbol}_${selectedCurrency.code}`]);
          if (!price) {
            LatestPrice.$insert({
              data: {
                coin,
                currency: selectedCurrency.code,
                updated: +new Date(),
                data,
              },
            });
            return false;
          }
          return true;
        };

        const whereLatestPrice = (record, item) => {
          return (
            record.coin === item.coin
            && record.currency === item.currency
          );
        };

        if (checkPriceExists(coin, priceData)) {
          LatestPrice.$update({
            where: (record) => {
              return whereLatestPrice(record, {
                coin,
                currency: selectedCurrency.code,
              });
            },
            data: {
              updated: +new Date(),
              data: priceData,
            },
          });
        }

        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  storeChartData(coin, period, chartData) {
    const { selectedCurrency } = this.vm.$store.state.settings;

    return new Promise(async (resolve) => {
      const checkChartDataExists = (symbol, data) => {
        const chartDataExists = Prices.find([`${symbol}_${selectedCurrency.code}_${period}`]);
        if (!chartDataExists) {
          Prices.$insert({
            data: {
              coin,
              currency: selectedCurrency.code,
              period,
              updated: +new Date(),
              data,
            },
          });
          return false;
        }
        return true;
      };
      const whereChartData = (record, item) => {
        return (
          record.coin === item.coin
          && record.currency === item.currency
          && record.period === item.period
        );
      };

      if (checkChartDataExists(coin, chartData)) {
        Prices.$update({
          where: (record) => {
            return whereChartData(record, {
              coin,
              currency: selectedCurrency.code,
              period,
            });
          },
          data: {
            updated: +new Date(),
            data: chartData,
          },
        });
      }
      resolve();
    });
  }

  /**
   * Calls the API and and stores the price data
   */
  async loadPriceFeed() {
    const {
      supportedCoins,
      selectedCurrency,
    } = this.vm.$store.state.settings;

    const coins = supportedCoins.map((coin) => {
      return coin.symbol;
    });

    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }

    coins.filter(onlyUnique);

    try {
      const prices = await this.getPriceFeed(coins);

      const promises = [];
      prices.data.forEach((data) => {
        promises.push(new Promise((res) => {
          return res(this.storePriceData(data.code, data[selectedCurrency.code]));
        }));
      });

      await Promise.all(promises);
    } catch (error) {
      this.vm.$toast.create(10, error.message, this.delay);
    }
  }

  /**
   * Calls the API and stores the price data for a coin
   */
  async loadCoinPriceData(coin) {
    const { selectedCurrency } = this.vm.$store.state.settings;

    const dayData = await this.getHistoricalData(coin, selectedCurrency.code, 'day');
    const weekData = await this.getHistoricalData(coin, selectedCurrency.code, 'week');
    const monthData = await this.getHistoricalData(coin, selectedCurrency.code, 'month');

    if (dayData && weekData && monthData) {
      this.storeChartData(coin, 'day', dayData.data);
      this.storeChartData(coin, 'week', weekData.data);
      this.storeChartData(coin, 'month', monthData.data);
    }

    const latestPrice = await this.getPriceFeed(
      [coin],
      [selectedCurrency.code],
    );

    if (latestPrice) {
      const prices = latestPrice.data[0];
      this.storePriceData(coin, prices[selectedCurrency.code]);
    }
  }
}


export default ({ Vue }) => {
  Vue.prototype.BackEndService = BackEndService;
};
