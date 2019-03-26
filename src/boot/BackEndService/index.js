import axios from 'axios';
import Account from '@/store/wallet/entities/account';
import LatestPrice from '@/store/latestPrice';


class BackEndService {
  vm = null;

  accessToken = null;

  refreshToken = null;

  accountId = null;

  account = null;

  password = null;

  constructor(vm, authenticatedAccount, password) {
    this.vm = vm;
    this.accountId = authenticatedAccount;
    this.account = this.vm.$store.getters['entities/account/find'](this.accountId);
    this.password = password;
    this.setRefreshToken(this.account.refresh_token);
    this.delay = 500;
    this.longDelay = 2500;
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
      const attemptLimit = 25;
      if (attempts >= attemptLimit) {
        this.vm.errorHandler(new Error('Failed to connect to the server'), false);
        return false;
      }

      try {
        if (this.refreshToken) {
          try {
            // access denied, refresh access token
            const code = await this.refreshAuth();
            const created = 201;
            if (code === created) {
              return resolve(true);
            }
          } catch (error) {
            // refresh token failed, re-authenticate
            await this.auth();
            return resolve(true);
          }
        } else {
          const code = await this.auth();
          const ok = 200;
          if (code === ok) {
            return resolve(true);
          }
        }
      } catch (err) {
        this.vm.errorHandler(err);
      }
      const timeout = 2500;
      setTimeout(() => {
        this.vm.$toast.create(10, 'Failed to connect to the server', this.delay);
        resolve(this.connect(attempts += 1));
      }, timeout);

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
  async try(URL, attempts = 0) {
    const attemptLimit = 3;
    if (attempts >= attemptLimit) {
      this.vm.errorHandler(new Error('Failed to connect to the server'), false);
    }


    try {
      const config = await this.getAxiosConfig();
      const response = await axios.get(URL, config);
      this.setRefreshToken(response.headers.new_refresh_token);
      return response;
    } catch (err) {
      attempts += 1;

      if (err.response) {
        const unauthorized = 401;
        if (err.response.status === unauthorized) {
          if (this.refreshToken) {
            try {
              // access denied, refresh access token
              await this.refreshAuth();
            } catch (error) {
              // refresh token failed, re-authenticate
              await this.auth();
            }
          } else {
            // no refresh token, authenticate
            await this.auth();
          }
        }
      }

      this.vm.errorHandler(err);

      return new Promise((resolve) => {
        setTimeout(async () => {
          resolve(this.try(URL, attempts));
        }, this.longDelay);
      });
    }
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
        promises.push(new Promise(async (res) => {
          return res(await this.storePriceData(data.code, data[selectedCurrency.code]));
        }));
      });

      await Promise.all(promises);
    } catch (e) {
      this.vm.$toast.create(10, e.message, this.delay);
    }
  }
}


export default ({ Vue }) => {
  Vue.prototype.BackEndService = BackEndService;
};
