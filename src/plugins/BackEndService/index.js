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
  }

  /**
   * Used to set value of the new refresh token
   * Also encrypts and puts the token in the persistent database
   * @param {String} token
   */
  setRefreshToken(token) {
    Account.$update({
      where: (record) => { return record.id === this.accountId; },
      data: { refresh_token: token },
      password: this.password,
    });

    this.refreshToken = token;
  }

  connect(attempts = 0) {
    return new Promise(async (resolve, reject) => {
      if (attempts >= 1000) {
        this.vm.$toast.create(10, 'Failed to connect to the server', 500);
        reject(new Error('Failed to connect to the server'));
        return false;
      }

      if (this.refreshToken) {
        const code = await this.refreshAuth();
        if (code === 201) {
          resolve(true);
          return false;
        }
      } else {
        const code = await this.auth();
        if (code === 200) {
          resolve(true);
          return false;
        }
      }

      setTimeout(() => {
        this.vm.$toast.create(10, 'Failed to connect to the server', 500);
        this.connect(attempts += 1);
      }, 2500);

      return false;
    });
  }

  async auth() {
    const response = await axios.get(`${process.env.BACKEND_SERVICE_URL}/auth/token/fake`);

    if (response.data) {
      this.accessToken = response.data.accessToken;
      this.setRefreshToken(response.data.refreshToken);
    }

    return response.status;
  }

  async refreshAuth() {
    const data = { refresh_token: this.refreshToken };
    const response = await axios.post(`${process.env.BACKEND_SERVICE_URL}/auth/refresh`, data);

    if (response.data) {
      this.accessToken = response.data.accessToken;
      this.setRefreshToken(response.data.refreshToken);
    }

    return response.status;
  }

  async getAxiosConfig() {
    return {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    };
  }

  async try(URL, attempts = 0) {
    if (attempts >= 5) return 'failure';

    try {
      const config = await this.getAxiosConfig();
      const response = await axios.get(URL, config);
      this.setRefreshToken(response.headers.new_refresh_token);
      return response;
    } catch (err) {
      attempts += 1;

      if (err.response) {
        if (err.response.status === 401) {
          if (this.refreshToken) {
            try {
              // request failed, refresh
              await this.refreshAuth();
            } catch (error) {
              // refresh token failed, re-authenticate
              await this.auth();
            }
          } else {
            // no refresh token, authenticate
            await this.auth();
          }

          return new Promise((resolve) => {
            setTimeout(async () => {
              const result = await this.try(URL, attempts);
              resolve(result);
            }, 1000);
          });
        }

        throw new Error(`External API: ${err.response.status}`);
      } else if (err.request) {
        throw new Error('BackEndService: no response received');
      } else {
        throw new Error(err.message);
      }
    }
  }

  async getPriceFeed(coins, currencies = ['ALL']) {
    const result = await this.try(`${process.env.BACKEND_SERVICE_URL}/price-feed/${coins.join(',')}/${currencies.join(',')}`);
    return result;
  }

  async getHistoricalData(coin, currency, period) {
    const result = await this.try(`${process.env.BACKEND_SERVICE_URL}/price-history/${coin}/${currency}/${period}`);

    result.data.data = result.data.data.map((x) => {
      return { t: x.time * 1000, y: x.close };
    });

    return result.data;
  }

  async storePriceData(coin, latestPrice) {
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

        if (checkPriceExists(coin, latestPrice)) {
          LatestPrice.$update({
            where: (record) => {
              return whereLatestPrice(record, {
                coin,
                currency: selectedCurrency.code,
              });
            },
            data: {
              updated: +new Date(),
              data: latestPrice,
            },
          });
        }
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

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
      this.vm.$toast.create(10, e.message, 500);
    }

    return true;
  }
}


export default ({ Vue }) => {
  Vue.prototype.BackEndService = BackEndService;
};
