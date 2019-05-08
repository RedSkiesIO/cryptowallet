import Router from '@/router';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';

global.scrollTo = jest.fn();
const localVue = createLocalVue();
localVue.use(VueRouter);
const router = Router;

shallowMount({ name: 'mock', template: '<div><router-view /></div>' }, {
  localVue,
  router,
});

describe('Vue router', () => {
  it('routes to setup', (done) => {
    router.push({ path: '/setup/0' });
    setTimeout(() => {
      expect(router.history.current.name).toBe('setup');
      done();
    });
  }, 0);

  it('routes to settings ', (done) => {
    router.push({ path: '/settings' });
    setTimeout(() => {
      expect(router.history.current.name).toBe('settings');
      done();
    });
  }, 0);

  it('routes to wallet ', (done) => {
    router.push({ path: '/wallet' });
    setTimeout(() => {
      expect(router.history.current.name).toBe('wallet');
      done();
    });
  }, 0);

  it('routes to wallet single ', (done) => {
    router.push({ path: '/wallet/single/1' });
    setTimeout(() => {
      expect(router.history.current.name).toBe('walletSingle');
      done();
    });
  }, 0);

  it('rotes to coin single prices', (done) => {
    router.push({ path: '/wallet/single/prices/1' });
    setTimeout(() => {
      expect(router.history.current.name).toBe('coinSinglePrices');
      done();
    });
  }, 0);

  it('routes to send coin single ', (done) => {
    router.push({ path: '/wallet/single/send/1' });
    setTimeout(() => {
      expect(router.history.current.name).toBe('sendCoinSingle');
      done();
    });
  }, 0);

  it('rotes to receive coin single ', (done) => {
    router.push({ path: '/wallet/single/receive/1' });
    setTimeout(() => {
      expect(router.history.current.name).toBe('receiveCoinSingle');
      done();
    });
  }, 0);

  it('routes to send coin ', (done) => {
    router.push({ path: '/wallet/send/1' });
    setTimeout(() => {
      expect(router.history.current.name).toBe('sendCoin');
      done();
    });
  }, 0);

  it('routes to receive Coin ', (done) => {
    router.push({ path: '/wallet/receive/1' });
    setTimeout(() => {
      expect(router.history.current.name).toBe('receiveCoin');
      done();
    });
  }, 0);


  it('routes to coin history ', (done) => {
    router.push({ path: '/wallet/history/1' });
    setTimeout(() => {
      expect(router.history.current.name).toBe('coinHistory');
      done();
    });
  }, 0);

  it('routes to exchange ', (done) => {
    router.push({ path: '/wallet/exchange/' });
    setTimeout(() => {
      expect(router.history.current.name).toBe('exchange');
      done();
    });
  }, 0);

  it('routes to coin prices ', (done) => {
    router.push({ path: '/wallet/prices/1' });
    setTimeout(() => {
      expect(router.history.current.name).toBe('coinPrices');
      done();
    });
  }, 0);

  it('routes to 404 ', (done) => {
    router.push({ path: '/fake/path' });
    setTimeout(() => {
      expect(router.history.current.name).toBe('404');
      done();
    });
  }, 0);
});
