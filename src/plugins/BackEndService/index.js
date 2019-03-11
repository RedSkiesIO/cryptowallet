/*eslint-disable*/
import axios from 'axios';

class BackEndService {
  accessToken = null;
  _refreshToken = null;

  get refreshToken() {
    return this._refreshToken;
  }

  set refreshToken(token) {
    this._refreshToken = token;
  }

  constructor(refreshToken) {
    this._refreshToken = refreshToken;
  }

  async auth() {
    console.log('auth');
    const response = await axios.get('http://localhost:3000/auth/token/fake');

    if (response.data) {
      this.accessToken = response.data.accessToken;
      this.refreshToken = response.data.refreshToken;
    }
  }

  async refreshAuth() {
    const data = { refresh_token: this.refreshToken }
    const response = await axios.post('http://localhost:3000/auth/refresh', data);

    if (response.data) {
      this.accessToken = response.data.accessToken;
      this.refreshToken = response.data.refreshToken;
    }
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
      console.log('config', config.headers.Authorization)
      const response = await axios.get(URL, config);
      this.refreshToken = response.headers.new_refresh_token;
      return response;
    } catch (err) {
      attempts += 1;

      if (err.response) {
        if (err.response.status === 401) {
          console.log('401', err.response);
          if (this._refreshToken) {
            try {
              // request failed, refresh
              await this.refreshAuth();
            } catch (err) {
              // refresh token failed, re-authenticate
              await this.auth();
            }

          } else {
            // no refresh token, authenticate
            await this.auth();
          }

          return new Promise((resolve, reject) => {
            setTimeout(async () => {
              const result = await this.try(URL, attempts);
              resolve(result);
            }, 1000)
          });
        }

        throw new Error(`External API: ${err.response.status}`);
      } else if (err.request) {
        throw new Error(`BackEndService: no response received`);
      } else {
        throw new Error(err.message);
      }
    }
  }

  async getPriceFeed(options) {
    const result = await this.try('http://localhost:3000/price-feed/ETH/ALL');
    return result;
  }
}

function backEndServiceFactory(store) {
  return BackEndService;
}

export default ({ Vue, store }) => {
  Vue.prototype.BackEndService = backEndServiceFactory(store);
};
